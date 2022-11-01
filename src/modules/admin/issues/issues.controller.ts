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
