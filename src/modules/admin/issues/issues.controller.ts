import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  UseFilters,
} from '@nestjs/common';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { WorkflowInstancesService } from '../workflowinstances/workflowinstances.service';
import { IssuesService } from './issues.service';

@Controller('issues')
@UseFilters(ExternalServerExceptionFilter)
export class IssuesController {
  @Inject(WorkflowInstancesService)
  private readonly wfiService: WorkflowInstancesService;

  @Inject(IssuesService)
  private readonly issuesService: IssuesService;

  @Get('failed')
  async getAcknowledgedTaskErrors(@Query('acknowledged') acknowledged: string) {
    if (!acknowledged || !acknowledged.trim()) {
      throw new BadRequestException('acknowledged query value is missing');
    }

    const response = await this.wfiService.getAcknowledgedTaskErrors(
      acknowledged,
    );

    return this.issuesService.getIssues(response);
  }
}
