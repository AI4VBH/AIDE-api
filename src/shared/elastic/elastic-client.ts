import { Inject, Injectable, UseFilters } from '@nestjs/common';
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
    } as ClientOptions);
    this.searchIndex = config.get<string>('ELASTIC_INDEX');
  }

  public searchWorkflowInstance(id: string) {
    return { query: { match: { 'Properties.workflowInstanceId': id } } };
  }

  public searchCorrilation(id: string) {
    return { query: { match: { 'Properties.correlationId': id } } };
  }

  public searchExecution(id: string) {
    return { query: { match: { 'Properties.executionId': id } } };
  }

  public searchTask(id: string) {
    return { query: { match: { 'Properties.taskId': id } } };
  }

  public async getLogs(id: string) {
    try {
      return await this.search({
        index: this.searchIndex,
        body: this.searchExecution(id),
      });
    } catch (error) {
      return { ...error.meta };
    }
  }
}
