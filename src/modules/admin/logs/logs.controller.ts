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
  Param,
  UseFilters,
} from '@nestjs/common';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { LogsService } from './logs.service';

@Controller('logs')
@UseFilters(ExternalServerExceptionFilter)
export class LogsController {
  constructor(private readonly appService: LogsService) {}

  @Get(':id')
  getLogs(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('id param cannot be empty');
    }
    return this.appService.getLogByTask(id);
  }
}
