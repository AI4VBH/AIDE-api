import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecutionStatsService {
  getExecutionStats(): string {
    return 'Hello World!';
  }
}
