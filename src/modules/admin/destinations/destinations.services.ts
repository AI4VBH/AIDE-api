import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { IDestination } from './destinations.interface';

export class DestinationsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  getDestinations() {
    return null;
  }

  registerDestination(destination: IDestination) {
    return null;
  }
}
