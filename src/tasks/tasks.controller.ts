import { Controller, Get, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly appService: TasksService) {}

  @Get()
  getHello(): string {
    return this.appService.getTasks();
  }

  @Patch()
  dismissTask(): string {
    return this.appService.dismissTask();
  }
}
