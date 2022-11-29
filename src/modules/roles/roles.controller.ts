/*
 * Copyright 2022 Crown Copyright
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

import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  Put,
  Query,
} from '@nestjs/common';
import { NewRoleDto } from './dto/new-role.dto';
import { RolesService } from './roles.service';
import { KeycloakAdminExceptionFilter } from 'shared/keycloak/keycloak-admin-exception.filter';
import { Roles } from 'nest-keycloak-connect';
import { PaginatedRolesResponse, Role } from './roles.interfaces';

@Controller('roles')
@UseFilters(KeycloakAdminExceptionFilter)
@Roles({ roles: ['realm:admin', 'realm:user_management'] })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('list')
  async getAllRoles(): Promise<Role[]> {
    return await this.rolesService.getAllRoles();
  }

  @Get()
  getAllFiltered(
    @Query('first') first = 0,
    @Query('max') max = 5,
    @Query('search') search?: string,
  ): Promise<PaginatedRolesResponse> {
    return this.rolesService.getAllRolesFiltered(first, max, search);
  }

  @Get(':roleId')
  getRole(@Param('roleId') roleId: string): Promise<RoleRepresentation> {
    return this.rolesService.getRole(roleId);
  }

  @Delete(':roleId')
  deleteRole(@Param('roleId') roleId: string): Promise<void> {
    return this.rolesService.deleteRole(roleId);
  }

  @Post()
  createRole(@Body() newRole: NewRoleDto) {
    return this.rolesService.createRole(newRole.name, newRole.description);
  }

  @Put(':roleId')
  updateRole(@Param('roleId') roleId: string, @Body() newRole: NewRoleDto) {
    return this.rolesService.updateRole(
      roleId,
      newRole.name,
      newRole.description,
    );
  }
}
