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

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions } from '@opensearch-project/opensearch';
import { parseBoolean } from 'shared/util/parseBoolean';

@Injectable()
export class ElasticClient extends Client {
  searchIndex: string;
  public static createNode(config: ConfigService): string {
    const ssl = parseBoolean(config.get('ELASTIC_USE_SSL'));
    const host = config.get<string>('ELASTIC_HOST');
    const port = config.get('ELASTIC_PORT');
    const prefix = ssl ? 'https' : 'http';

    return `${prefix}://${host}:${port}`;
  }

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      node: ElasticClient.createNode(config),
      auth: {
        username: config.get<string>('ELASTIC_USERNAME'),
        password: config.get<string>('ELASTIC_PASSWORD'),
      },
      ssl: {
        rejectUnauthorized: false,
        requestCert: false,
      },
    } as ClientOptions);
    this.searchIndex = config.get<string>('ELASTIC_INDEX');
  }

  public searchExecution(id: string) {
    return { query: { match: { 'task.ExecutionId': id } } };
  }

  public async getLogs(id: string) {
    try {
      return await this.search({
        index: this.searchIndex,
        body: this.searchExecution(id),
      });
    } catch (error) {
      throw new ElasticClientException(error);
    }
  }
}

export class ElasticClientException extends Error {
  constructor(message: string) {
    super(message);
  }
}
