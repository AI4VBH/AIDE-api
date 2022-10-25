import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  Destination,
  MonaiWorkflow,
  PagedMonaiWorkflows,
} from './monai-workflow.interfaces';
import { mapToPagedWorkflowsDto } from './workflows.mapper';
import { WorkflowDto } from './dto/aide-workflow.dto';
import { WorkflowServiceException } from './workflow.service.exceptions';

@Injectable()
export class WorkflowsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async getPagedWorkflows(pageNumber: number, pageSize: number) {
    const params = new URLSearchParams({
      pageSize: `${pageSize || ''}`,
      pageNumber: `${pageNumber || ''}`,
    });

    const paged = await firstValueFrom(
      this.httpService.get<PagedMonaiWorkflows>(`/workflows?${params}`),
    );

    return mapToPagedWorkflowsDto(paged.data);
  }

  async getWorkflowDetail(workflowId: string) {
    const detail = await firstValueFrom(
      this.httpService.get<MonaiWorkflow>(`/workflows/${workflowId}`),
    );

    return detail.data;
  }

  async registerAeTitleAndVerifyDestinations(
    aeTitle: string,
    destinations: string[],
  ) {
    if (!aeTitle || !aeTitle.trim()) {
      throw new WorkflowServiceException(
        'AE Title not found, config is invalid',
      );
    }

    const baseURL = this.configService.get<string>('MIG_API_HOST');
    const aeTitleRequest = { name: aeTitle, aeTitle: aeTitle };

    await firstValueFrom(
      this.httpService.post('/config/ae', aeTitleRequest, {
        baseURL,
        validateStatus: (status: number) => status === 201 || status === 409,
      }),
    );

    if (destinations && destinations.length > 0) {
      const getDestination = await firstValueFrom(
        this.httpService.get<Destination[]>('/config/destination', {
          baseURL,
        }),
      );

      const existingDestinations = getDestination.data.map(
        (item) => item.aeTitle,
      );

      if (!destinations.every((v) => existingDestinations.includes(v))) {
        throw new WorkflowServiceException(
          'Not all export destinations are registered',
        );
      }
    }
  }

  async createWorkflow(workflow: Partial<WorkflowDto>) {
    const aeTitle = workflow?.informatics_gateway?.ae_title as string;
    const destinations = workflow?.informatics_gateway
      ?.export_destinations as string[];

    await this.registerAeTitleAndVerifyDestinations(aeTitle, destinations);

    const result = await firstValueFrom(
      this.httpService.post('/workflows', workflow),
    );

    return result.data;
  }

  async editWorkflow(workflowId: string, workflow: Partial<WorkflowDto>) {
    const aeTitle = workflow?.informatics_gateway?.ae_title as string;
    const destinations = workflow?.informatics_gateway
      ?.export_destinations as string[];

    await this.registerAeTitleAndVerifyDestinations(aeTitle, destinations);

    const result = await firstValueFrom(
      this.httpService.put(`/workflows/${workflowId}`, workflow),
    );

    return result.data;
  }

  async deleteWorkflow(workflowId: string) {
    const result = await firstValueFrom(
      this.httpService.delete(`/workflows/${workflowId}`),
    );

    return result.data;
  }
}