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
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { WorkflowInstancesService } from '../workflowinstances/workflowinstances.service';
import { IssuesService } from './issues.service';

@Controller('issues')
@Roles({ roles: ['realm:admin'] })
@UseFilters(ExternalServerExceptionFilter)
export class IssuesController {
  @Inject(WorkflowInstancesService)
  private readonly wfiService: WorkflowInstancesService;

  @Inject(IssuesService)
  private readonly issuesService: IssuesService;

  @Get('failed')
  async getAcknowledgedTaskErrors() {
    const response = await this.wfiService.getAcknowledgedTaskErrors();

    return this.issuesService.getIssues(response);
  }
}
