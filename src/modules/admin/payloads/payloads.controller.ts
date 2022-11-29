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

import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
@Roles({ roles: ['realm:admin'] })
@UseFilters(ExternalServerExceptionFilter)
export class PayloadsController {
  @Inject(PayloadsService)
  private readonly payloadsService: PayloadsService;

  @Get()
  getPayloads(
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('patientName') patientName?: string,
    @Query('patientId') patientId?: string,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    return this.payloadsService.getPayloads(
      {
        pageNumber,
        pageSize,
      },
      patientName,
      patientId,
    );
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id) {
    return this.payloadsService.getPayloadExecutions(payload_id);
  }
}
