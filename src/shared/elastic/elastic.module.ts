import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpensearchModule } from 'nestjs-opensearch';
import { SearchService } from './elastic.service';

@Module({
  imports: [
    // See also: https://docs.nestjs.com/techniques/configuration
    ConfigModule,
    OpensearchModule.forRootAsync({
      clientName: 'baz',
      inject: [ConfigService],
      useFactory: (configService) => ({
        node: configService.get('ELASTIC_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
        tls: {
          rejectUnauthorized: false,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  providers: [SearchService],
  exports: [OpensearchModule, SearchService],
})
export class ElasticModule {}
