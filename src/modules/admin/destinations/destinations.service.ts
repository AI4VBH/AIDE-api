/*
 * Copyright 2022 Crown Copyright
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

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { IDestination } from './destinations.interface';

@Injectable()
export class DestinationsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async deleteDestination(name: string) {
    const baseURL = this.configService.get<string>('MIG_API_HOST');

    const response = await lastValueFrom(
      this.httpService.delete<IDestination>(`/config/destination/${name}`, {
        baseURL,
      }),
    );

    return response.data;
  }

  async getDestinations(): Promise<IDestination[]> {
    const baseURL = this.configService.get<string>('MIG_API_HOST');

    const response = await lastValueFrom(
      this.httpService.get<IDestination[]>('/config/destination', {
        baseURL,
      }),
    );

    return response.data;
  }

  async registerDestination(destination: IDestination) {
    const baseURL = this.configService.get<string>('MIG_API_HOST');

    const result = await lastValueFrom(
      this.httpService.post('/config/destination', destination, {
        baseURL,
      }),
    );

    return result.data;
  }

  async updateDestination(destination: IDestination) {
    const baseURL = this.configService.get<string>('MIG_API_HOST');

    const result = await lastValueFrom(
      this.httpService.put('/config/destination', destination, {
        baseURL,
      }),
    );

    return result.data;
  }

  async echoDestination(name: string) {
    const baseURL = this.configService.get<string>('MIG_API_HOST');

    const result = await lastValueFrom(
      this.httpService.get(`/config/destination/cecho/${name}`, {
        baseURL,
      }),
    );

    if (result.status !== 200) {
      throw new Error('Echo destination request failed');
    }

    return result.data;
  }
}
