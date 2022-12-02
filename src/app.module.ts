/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  RoleGuard,
} from 'nest-keycloak-connect';
import { getEnvPath } from 'shared/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { KeycloakService } from 'shared/keycloak/keycloak.service';
import { AdminModule } from 'modules/admin/admin.module';
import { ClinicalReviewModule } from 'modules/clinical-review/clinical-review.module';
import { ProxyModule } from 'modules/aide-hub-proxy/proxy.module';
import { HttpConfigService } from 'shared/http/http.service';
import { HttpModule } from '@nestjs/axios';
import { RolesModule } from 'modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomLogger } from 'shared/logger/custom-logger.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

const authenticationGuards =
  process.env.DISABLE_AUTH === 'true'
    ? []
    : [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RoleGuard,
        },
      ];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakService,
    }),
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AdminModule,
    UsersModule,
    ClinicalReviewModule,
    ProxyModule,
    RolesModule,
    WorkflowsModule,
  ],
  controllers: [],
  providers: [...authenticationGuards],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomLogger).forRoutes('*');
  }
}
