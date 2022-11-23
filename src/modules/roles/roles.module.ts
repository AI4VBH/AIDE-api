import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, KeycloakAdminService],
})
export class RolesModule {}
