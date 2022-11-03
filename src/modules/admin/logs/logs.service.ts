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
