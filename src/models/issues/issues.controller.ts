import { Controller, Get, Patch } from '@nestjs/common';
import { Task } from './issues.interface';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly appService: IssuesService) {}

  @Get()
  getHello(): Task {
    return this.appService.getIssues();
  }

  @Patch()
  dismissTask(): Task {
    return this.appService.dismissTask();
  }
}
