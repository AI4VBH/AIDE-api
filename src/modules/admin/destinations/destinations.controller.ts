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
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { IDestination } from './destinations.interface';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
@Roles({ roles: ['realm:admin'] })
@UseFilters(ExternalServerExceptionFilter)
export class DestinationsController {
  @Inject(DestinationsService)
  private readonly service: DestinationsService;

  @Delete(':name')
  deleteDestination(@Param('name') name: string) {
    return this.service.deleteDestination(name)
  }

  @Get()
  getDestinations() {
    return this.service.getDestinations();
  }

  @Post()
  registerDestination(@Body() destination: IDestination) {
    this.validateDestination(destination);

    return this.service.registerDestination(destination);
  }

  @Put(':name')
  updateDestination(@Body() destination: IDestination) {
    this.validateDestination(destination);

    return this.service.updateDestination(destination);
  }

  @Get('echo/:name')
  echoDestination(@Param('name') name) {
    return this.service.echoDestination(name);
  }

  private validateDestination(destination: IDestination) {
    if (!destination) {
      throw new BadRequestException('destination object cannot be empty');
    }

    const missingProps: string[] = [];

    ['aeTitle', 'hostIp', 'name', 'port'].forEach(
      (key) => !destination[key] && missingProps.push(key),
    );

    if (missingProps.length !== 0) {
      throw new BadRequestException(
        `The following properties are missing from the destinations object: ${missingProps.join(
          ', ',
        )}`,
      );
    }
  }
}
