/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
