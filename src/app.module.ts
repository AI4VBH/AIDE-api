import { Module } from '@nestjs/common';
import { KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationsModule } from './models/applications/applications.module';
import { ExecutionStatsModule } from './models/execution-stats/execution-stats.module';
import { GraphModule } from './models/graph/graph.module';
import { LogsModule } from './models/logs/logs.module';
import { PayloadsModule } from './models/payloads/payloads.module';
import { TasksModule } from './models/tasks/tasks.module';
import { getEnvPath } from './common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ElasticsearchConfigService } from './shared/elastic/elastic.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { KeycloakService } from './shared/keycloak/keycloak.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakService,
    }),
    ApplicationsModule,
    ExecutionStatsModule,
    GraphModule,
    LogsModule,
    PayloadsModule,
    TasksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
