import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { IDestination } from './destinations.interface';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  @Inject(DestinationsService)
  private readonly service: DestinationsService;

  @Get()
  getDestinations() {
    return this.service.getDestinations();
  }

  @Post()
  registerDestination(@Body() destination: IDestination) {
    return this.service.registerDestination(destination);
  }
}
