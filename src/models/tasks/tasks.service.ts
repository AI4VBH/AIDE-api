import { Injectable } from '@nestjs/common';
import { Task } from './task.interface';

@Injectable()
export class TasksService {
  getTasks(): Task {
    return {} as Task;
  }

  dismissTask(): Task {
    return {} as Task;
  }
}
