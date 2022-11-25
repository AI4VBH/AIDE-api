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

import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { ExecutionsService } from './executions.service';

@Controller('executions')
@UseFilters(ExternalServerExceptionFilter)
export class ExecutionsController {
  @Inject(ExecutionsService)
  private readonly executionsService: ExecutionsService;

  @Get(':workflow_instance_id/tasks/:execution_id/artifacts')
  async getWorkflowInstanceArtifacts(
    @Param('workflow_instance_id') workflowInstanceId: string,
    @Param('execution_id', ParseUUIDPipe) executionId: string,
  ) {
    return await this.executionsService.getWorkflowInstanceArtifacts(
      workflowInstanceId,
      executionId,
    );
  }

  @Get('artifact-download')
  async getArtifactDownloadUrl(
    @Query('key') file: string,
    @Res() response: Response,
  ) {
    if (!file || !file.trim()) {
      throw new BadRequestException('key query value is missing');
    }

    const { contentType, stream } = await this.executionsService.getArtifact(
      file,
    );

    if (contentType) {
      response.contentType(contentType);
    }

    const piped = stream.pipe(response);

    return piped;
  }

  @Get(':workflow_instance_id/tasks/:execution_id/metadata')
  getWorkflowInstanceMetadata(
    @Param('workflow_instance_id') workflowInstanceId: string,
    @Param('execution_id', ParseUUIDPipe) executionId: string,
  ) {
    return this.executionsService.getWorkflowInstanceMetadata(
      workflowInstanceId,
      executionId,
    );
  }
}
