import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminService } from '../../shared/keycloak-admin/keycloak-admin.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, KeycloakAdminService, ConfigService],
})
export class UsersModule {}
