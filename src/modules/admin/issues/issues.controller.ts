import { Controller, Get, Patch } from '@nestjs/common';
import { IssueDTO } from './issues.dto';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly appService: IssuesService) {}

  @Get()
  getHello(): IssueDTO[] {
    return this.appService.getIssues();
  }

  @Patch()
  dismissTask(): IssueDTO {
    return this.appService.dismissTask();
  }
}
