import { Controller, Get, Query } from '@nestjs/common';
import { ExecutionStat } from './overview.interface';
import { OverviewService } from './overview.service';

@Controller('overview')
export class OverviewController {
  constructor(private readonly executionStatsService: OverviewService) {}

  @Get()
  getOverview(@Query('period') period): ExecutionStat {
    return this.executionStatsService.getOverview(period);
  }
}
