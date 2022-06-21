import { Injectable } from '@nestjs/common';
import { Task } from './issues.interface';

@Injectable()
export class IssuesService {
  getIssues(): Task {
    return {} as Task;
  }

  dismissTask(): Task {
    return {} as Task;
  }
}
