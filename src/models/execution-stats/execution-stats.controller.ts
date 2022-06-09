import { Controller, Get } from '@nestjs/common';
import { ExecutionStat } from './execution-stat.interface';
import { ExecutionStatsService } from './execution-stats.service';

@Controller('execution-stats')
export class ExecutionStatsController {
  constructor(private readonly executionStatsService: ExecutionStatsService) {}

  @Get()
  getExecutionStats(): ExecutionStat {
    return this.executionStatsService.getExecutionStats();
  }
}
