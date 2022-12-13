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

import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModuleOptionsFactory, HttpModuleOptions } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createHttpOptions(): HttpModuleOptions {
    let encodeToken = Buffer.from(`${this.config.get<string>('MONAI_API_USER')}:${this.config.get<string>('MONAI_API_KEY')}`)
      .toString('base64');
    return {
      timeout: 5000,
      maxRedirects: 5,
      headers: {'Authorization': `Basic ${encodeToken}`},
      baseURL: this.config.get<string>('MONAI_API_HOST'),
    };
  }
}
