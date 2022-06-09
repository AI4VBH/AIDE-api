import { Injectable } from '@nestjs/common';
import { ExecutionStat } from './execution-stat.interface';

@Injectable()
export class ExecutionStatsService {
  getExecutionStats(): ExecutionStat {
    return {} as ExecutionStat;
  }
}
