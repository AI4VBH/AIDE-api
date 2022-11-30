/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const archiver = require('archiver');

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

    const objectList = await this.executionsService.getArtifacts(file);

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', function (error) {
      return response.status(500).json({ error });
    });

    response.attachment(`${file}.zip`);
    archive.pipe(response);

    for (const obj of objectList) {
      archive.append(obj.stream, { name: obj.name });
    }

    archive.finalize();
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
