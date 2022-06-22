import { Module } from '@nestjs/common';
import { KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ModelsModule } from './modules/admin/models/models.module';
import { OverviewModule } from './modules/admin/overview/overview.module';
import { GraphModule } from './modules/admin/graph/graph.module';
import { LogsModule } from './modules/logs/logs.module';
import { PayloadsModule } from './modules/admin/payloads/payloads.module';
import { IssuesModule } from './modules/admin/issues/issues.module';
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
    ModelsModule,
    OverviewModule,
    GraphModule,
    LogsModule,
    PayloadsModule,
    IssuesModule,
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
