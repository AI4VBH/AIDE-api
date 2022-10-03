import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { IDestination } from './destinations.interface';

@Injectable()
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
