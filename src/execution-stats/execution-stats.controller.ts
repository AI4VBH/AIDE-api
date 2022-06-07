import { Controller, Get } from '@nestjs/common';
import { ExecutionStatsService } from './execution-stats.service';

@Controller('execution-stats')
export class ExecutionStatsController {
  constructor(private readonly executionStatsService: ExecutionStatsService) {}

  @Get()
  getExecutionStats(): string {
    return this.executionStatsService.getExecutionStats();
  }
}
