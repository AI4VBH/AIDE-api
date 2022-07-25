import { Controller, Get, Patch } from '@nestjs/common';
import { Issue } from './issues.interface';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly appService: IssuesService) {}

  @Get()
  getHello(): Issue[] {
    return this.appService.getIssues();
  }

  @Patch()
  dismissTask(): Issue {
    return this.appService.dismissTask();
  }
}
