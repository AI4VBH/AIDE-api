import { Controller, Get, Patch } from '@nestjs/common';
import { Task } from './task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly appService: TasksService) {}

  @Get()
  getHello(): Task {
    return this.appService.getTasks();
  }

  @Patch()
  dismissTask(): Task {
    return this.appService.dismissTask();
  }
}
