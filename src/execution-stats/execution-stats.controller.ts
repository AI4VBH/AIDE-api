import { Controller, Get } from '@nestjs/common';
import { ExecutionStatsDto } from './dto/execution-stats.dto';
import { ExecutionStatsService } from './execution-stats.service';

@Controller('execution-stats')
export class ExecutionStatsController {
  constructor(private readonly executionStatsService: ExecutionStatsService) {}

  @Get()
  getExecutionStats(): ExecutionStatsDto {
    return this.executionStatsService.getExecutionStats();
  }
}
