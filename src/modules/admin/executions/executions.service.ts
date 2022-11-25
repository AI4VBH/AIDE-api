/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MinioClient, MinoiClientException } from 'shared/minio/minio-client';
import internal from 'stream';
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

  public get minioBaseUrl(): string {
    return this.minioClient.baseUrl;
  }

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

  async getArtifact(
    file: string,
  ): Promise<{ contentType: string; stream: internal.Readable }> {
    try {
      const stream = await this.minioClient.getObjectByName(file);
      const metadata = await this.minioClient.getObjectMetadata(file);

      return { stream, contentType: metadata['content-type'] };
    } catch (exception) {
      throw new MinoiClientException(exception.code);
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
