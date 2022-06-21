import { Controller, Get } from '@nestjs/common';
import { ExecutionStat } from './overview.interface';
import { OverviewService } from './overview.service';

@Controller('execution-stats')
export class OverviewController {
  constructor(private readonly executionStatsService: OverviewService) {}

  @Get()
  getOverview(): ExecutionStat {
    return this.executionStatsService.getOverview();
  }
}
