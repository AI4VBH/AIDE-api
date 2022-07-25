import { Module } from '@nestjs/common';
import { KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { LogsModule } from './modules/logs/logs.module';
import { getEnvPath } from './common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { KeycloakService } from './shared/keycloak/keycloak.service';
import { AdminModule } from './modules/admin/admin.module';
import { ClinicalReviewModule } from './modules/clinical-review/clinical-review.module';
import { OldAdminModule } from './modules/old-admin/old-admin.module';
import { ProxyModule } from './modules/proxy/proxy.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakService,
    }),
    LogsModule,
    AdminModule,
    ClinicalReviewModule,
    OldAdminModule,
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
