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
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import {
  CreateWorkflowDto,
  EditWorkflowDto,
  WorkflowDto,
} from './dto/aide-workflow.dto';
import { WorkflowValidationException } from './workflow.service.exceptions';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
@Roles({ roles: ['realm:admin'] })
@UseFilters(ExternalServerExceptionFilter)
export class WorkflowsController {
  @Inject(WorkflowsService)
  private readonly service: WorkflowsService;

  @Get()
  getWorkflows(
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    return this.service.getPagedWorkflows(pageNumber, pageSize);
  }

  @Get(':workflowId')
  getWorkflowById(@Param('workflowId') workflowId: string) {
    return this.service.getWorkflowDetail(workflowId);
  }

  @Post()
  async createWorkflow(@Body() createWorkflow: CreateWorkflowDto) {
    const { workflow } = createWorkflow;

    await this.service.validateWorkflow(workflow, '');

    return this.service.createWorkflow(workflow);
  }

  @Put(':workflowId')
  async editWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() editWorkflow: EditWorkflowDto,
  ) {
    const { workflow } = editWorkflow.workflow;
    const { original_workflow_name } = editWorkflow;

    await this.service.validateWorkflow(workflow, original_workflow_name);

    return this.service.editWorkflow(
      workflowId,
      workflow,
      original_workflow_name,
    );
  }

  @Delete(':workflowId')
  deleteWorkflowById(@Param('workflowId') workflowId: string) {
    return this.service.deleteWorkflow(workflowId);
  }
}
