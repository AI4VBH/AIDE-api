import {
  BadRequestException,
  Body,
  Controller,
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
