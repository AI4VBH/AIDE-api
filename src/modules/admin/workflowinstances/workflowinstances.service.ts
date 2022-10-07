import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { MonaiWorkflowInstance } from './workflowinstances.interface';

@Injectable()
export class WorkflowInstancesService {
  @Inject(HttpService)
  private readonly httpService: HttpService;
  private readonly CONTROLLER: string = 'workflowinstances';
  async acknowledgeTaskError(
    workflow_instance_id: string,
    execution_id: string,
  ): Promise<MonaiWorkflowInstance> {
    const response = await lastValueFrom(
      this.httpService.put<MonaiWorkflowInstance>(
        `${this.CONTROLLER}/${workflow_instance_id}/executions/${execution_id}/acknowledge`,
      ),
    );

    return response.data;
  }

  async getAcknowledgedTaskErrors(
    sinceDate: string,
  ): Promise<MonaiWorkflowInstance[]> {
    const response = await lastValueFrom(
      this.httpService.get<MonaiWorkflowInstance[]>(
        `workflowinstances/failed?acknowledged=${sinceDate}`,
      ),
    );

    return response.data;
  }
}
