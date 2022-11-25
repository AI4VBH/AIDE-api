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
import { ElasticClient } from 'shared/elastic/elastic-client';
import { LogsDto } from './logs.dto';
import { IElasticLogObject } from './models/logs.interfaces';

@Injectable()
export class LogsService {
  @Inject(ElasticClient)
  private readonly elasticClient: ElasticClient;

  async getLogByTask(id: string): Promise<LogsDto[]> {
    const response = await this.elasticClient.getLogs(id);

    const body = response.body as IElasticLogObject;

    return body.hits.hits.map(({ _source }) => {
      return {
        correlationId: _source['CorrelationId'],
        workflowInstanceId: _source['workflowInstanceId'],
        task: _source['task'],
        message: _source['Message'],
        taskStatus: _source['taskStatus'],
        level: _source['Level'],
        timestamp: _source['@timestamp'],
      } as LogsDto;
    });
  }
}
