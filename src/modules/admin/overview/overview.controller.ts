import { Controller, Get, Query } from '@nestjs/common';
import { OverviewDTO } from './overview.dto';
import { OverviewService } from './overview.service';

@Controller('overview')
export class OverviewController {
  constructor(private readonly executionStatsService: OverviewService) {}

  @Get()
  getOverview(@Query('period') period): OverviewDTO {
    return this.executionStatsService.getOverview(period);
  }
}
