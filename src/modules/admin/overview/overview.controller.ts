import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import { OverviewDTO } from './overview.dto';
import { OverviewService } from './overview.service';

@Controller('overview')
@Roles({ roles: ['realm:admin'] })
export class OverviewController {
  constructor(private readonly executionStatsService: OverviewService) {}

  @Get()
  getOverview(@Query('period') period): OverviewDTO {
    return this.executionStatsService.getOverview(period);
  }
}
