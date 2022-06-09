import { Module } from '@nestjs/common';
import { KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakModule } from './keycloak/keycloak.module';
import { KeycloakService } from './keycloak/keycloak.service';
import { ApplicationsModule } from './models/applications/applications.module';
import { ExecutionStatsModule } from './models/execution-stats/execution-stats.module';
import { GraphModule } from './models/graph/graph.module';
import { LogsModule } from './models/logs/logs.module';
import { PayloadsModule } from './models/payloads/payloads.module';
import { TasksModule } from './models/tasks/tasks.module';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakService,
      imports: [KeycloakModule],
    }),
    KeycloakModule,
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
