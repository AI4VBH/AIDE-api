import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  MonaiWorkflow,
  PagedMonaiWorkflows,
} from './monai-workflow.interfaces';
import { mapToPagedWorkflowsDto } from './workflows.mapper';

@Injectable()
export class WorkflowsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

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

  async createWorkflow(workflow: object) {
    const result = await firstValueFrom(
      this.httpService.post('/workflows', workflow),
    );

    return result.data;
  }

  async editWorkflow(workflowId: string, workflow: object) {
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
