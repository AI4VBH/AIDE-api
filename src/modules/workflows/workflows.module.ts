import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RolesService } from 'modules/roles/roles.service';
import { HttpConfigService } from 'shared/http/http.service';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, RolesService, KeycloakAdminService],
})
export class WorkflowsModule {}
