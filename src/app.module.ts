import { Module } from '@nestjs/common';
import { KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { getEnvPath } from './common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { KeycloakService } from './shared/keycloak/keycloak.service';
import { AdminModule } from './modules/admin/admin.module';
import { ClinicalReviewModule } from './modules/clinical-review/clinical-review.module';
import { ProxyModule } from './modules/aide-hub-proxy/proxy.module';
import { HttpConfigService } from './shared/http/http.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './modules/users/users.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
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
