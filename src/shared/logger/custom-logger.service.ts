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

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decodeToken } from 'shared/decorators/custom-decorators';

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
        this.logger.log(`
          status: ${response.statusCode}
          method: ${request.method}
          url: ${request.url}
          request-body: ${request.body}
          data: ${exitData.toString().substring(0, 1000)}
          username: ${username}
          session-id: ${correlationId}
        `);
      }
      response.send = send;
      return response.send(exitData);
    };

    next();
  }
}
