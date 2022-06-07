import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  getTasks(): string {
    return 'Hello World!';
  }

  dismissTask(): string {
    return 'Hello World!';
  }
}
