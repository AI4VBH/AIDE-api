import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ElasticsearchOptionsFactory,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return {
      node: this.config.get<string>('ELASTIC_NODE'),
    };
  }
}
