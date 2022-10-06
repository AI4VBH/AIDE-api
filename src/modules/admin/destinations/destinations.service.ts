import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IDestination } from './destinations.interface';

@Injectable()
export class DestinationsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async getDestinations(): Promise<IDestination[]> {
    const baseURL = this.configService.get<string>('MIG_API_HOST');

    const response = await firstValueFrom(
      this.httpService.get<IDestination[]>('/config/destination', {
        baseURL,
      }),
    );

    return response.data;
  }

  registerDestination(destination: IDestination) {
    return null;
  }
}
