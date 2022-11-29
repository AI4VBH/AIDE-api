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

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decodeToken } from 'shared/decorators/custom-decorators';
import * as util from 'util';

@Injectable()
export class CustomLogger implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const token = decodeToken(request);
    let username = '';
    let correlationId = '';

    if (token) {
      correlationId = token.sub;
      username = token.preferred_username;
    }

    const send = response.send;
    response.send = (exitData) => {
      if (
        response
          ?.getHeader('content-type')
          ?.toString()
          .includes('application/json')
      ) {
        // eslint-disable-next-line prettier/prettier
        this.logger.log(`status: ${response.statusCode}\nmethod: ${request.method}\nurl: ${request.url}\nrequest-body: ${util.format(request.body)}\ndata: ${exitData.toString().substring(0, 1000)}\nusername: ${username}\nsession-id: ${correlationId}`);
      }
      response.send = send;
      return response.send(exitData);
    };

    next();
  }
}
