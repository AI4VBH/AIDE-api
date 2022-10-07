import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MinioClient, MinoiClientException } from 'shared/minio/minio-client';
import { MonaiWorkflowInstance } from '../workflowinstances/workflowinstances.interface';
import {
  ExecutionsServiceException,
  ExecutionsServiceExceptionType,
} from './executions.service.exceptions';

@Injectable()
export class ExecutionsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(MinioClient)
  private readonly minioClient: MinioClient;

  async getWorkflowInstanceArtifacts(
    workflowInstanceId: string,
    executionId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get<MonaiWorkflowInstance>(
        `/workflowinstances/${workflowInstanceId}`,
      ),
    );

    const task = (response.data?.tasks ?? []).find(
      (t) => t.execution_id === executionId,
    );

    if (!task) {
      throw new ExecutionsServiceException(
        ExecutionsServiceExceptionType.MISSING_TASK,
        'Task not found',
      );
    }

    const artifacts = task?.output_artifacts ?? {};

    return artifacts;
  }

  async getArtifactUrl(file: string) {
    try {
      const url = await this.minioClient.getPresignedObjectUrl(file);

      return url;
    } catch (exception) {
      throw new MinoiClientException(exception.message);
    }
  }

  async getWorkflowInstanceMetadata(
    workflowInstanceId: string,
    executionId: string,
  ) {
    const response = await lastValueFrom(
      this.httpService.get<MonaiWorkflowInstance>(
        `/workflowinstances/${workflowInstanceId}`,
      ),
    );

    const task = (response.data?.tasks ?? []).find(
      (t) => t.execution_id === executionId,
    );

    if (!task) {
      throw new ExecutionsServiceException(
        ExecutionsServiceExceptionType.MISSING_TASK,
        'Task not found',
      );
    }

    return task?.execution_stats ?? {};
  }
}
