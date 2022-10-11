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

    if (response.statusCode != 200 || response.body.hits.total.value == 0) {
      return [];
    }

    const body = response.body as IElasticLogObject;

    const dtoArr: LogsDto[] = [];
    for (const hit of body.hits.hits) {
      dtoArr.push({
        level: hit._source.Level,
        renderedMessage: hit._source.RenderedMessage,
        timestamp: hit._source.Timestamp,
      });
    }

    return dtoArr;
  }
}
