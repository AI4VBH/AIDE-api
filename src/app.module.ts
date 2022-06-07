import { Module } from '@nestjs/common';
import { KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakModule } from './keycloak/keycloak.module';
import { KeycloakService } from './keycloak/keycloak.service';
import { ApplicationsController } from './applications/applications.controller';
import { ExecutionStatsController } from './execution-stats/execution-stats.controller';
import { TasksController } from './tasks/tasks.controller';
import { LogsController } from './logs/logs.controller';
import { PayloadsController } from './payloads/payloads.controller';
import { ApplicationsService } from './applications/applications.service';
import { ExecutionStatsService } from './execution-stats/execution-stats.service';
import { TasksService } from './tasks/tasks.service';
import { LogsService } from './logs/logs.service';
import { PayloadsService } from './payloads/payloads.service';
import { GraphController } from './graph/graph.controller';
import { GraphService } from './graph/graph.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakService,
      imports: [KeycloakModule],
    }),
    KeycloakModule,
  ],
  controllers: [
    ApplicationsController,
    ExecutionStatsController,
    TasksController,
    LogsController,
    PayloadsController,
    GraphController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    ApplicationsService,
    ExecutionStatsService,
    TasksService,
    LogsService,
    PayloadsService,
    GraphService,
  ],
})
export class AppModule {}
