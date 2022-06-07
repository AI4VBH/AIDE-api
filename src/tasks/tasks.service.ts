import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  getTasks(): TaskDto {
    return new TaskDto();
  }

  dismissTask(): TaskDto {
    return new TaskDto();
  }
}
