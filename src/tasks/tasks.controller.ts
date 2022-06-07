import { Controller, Get, Patch } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly appService: TasksService) {}

  @Get()
  getHello(): TaskDto {
    return this.appService.getTasks();
  }

  @Patch()
  dismissTask(): TaskDto {
    return this.appService.dismissTask();
  }
}
