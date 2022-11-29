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

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';

@Injectable()
export class RolesService {
  @Inject(KeycloakAdminService)
  private readonly adminService: KeycloakAdminService;

  @Inject(ConfigService)
  private readonly config: ConfigService;

  async getAllRoles() {
    const staticRoles = this.config.get<string[]>('KEYCLOAK_STATIC_ROLES');

    let roles = await this.adminService.performAction((realm, client) =>
      client.roles.find({ realm }),
    );

    const exclusionRoles = this.config.get<string[]>(
      'KEYCLOAK_EXCLUSION_ROLES',
    );

    roles = roles.filter((role) => !exclusionRoles.includes(role.name));

    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      editable: !staticRoles.includes(r.name),
    }));
  }

  async getAllRolesFiltered(first: number, max: number, search?: string) {
    const staticRoles = this.config.get<string[]>('KEYCLOAK_STATIC_ROLES');
    const exclusionRoles = this.config.get<string>('KEYCLOAK_EXCLUSION_ROLES');

    let allRoles = await this.adminService.performAction((realm, client) =>
      client.roles.find({ realm }),
    );

    let filteredRoles = await this.adminService.performAction((realm, client) =>
      client.roles.find({ realm, search, first, max }),
    );

    filteredRoles = filteredRoles.filter(
      (role) => !exclusionRoles.includes(role.name),
    );
    allRoles = allRoles.filter((role) => !exclusionRoles.includes(role.name));

    let totalFilteredRoles = allRoles.length;
    if (search) {
      let filteredUnpagedRoles = await this.adminService.performAction(
        (realm, client) => client.roles.find({ realm, search }),
      );

      filteredUnpagedRoles = filteredUnpagedRoles.filter(
        (role) => !exclusionRoles.includes(role.name),
      );

      totalFilteredRoles = filteredUnpagedRoles.length;
    }

    const mapped = filteredRoles.map((r) => ({
      id: r.id,
      name: r.name,
      editable: !staticRoles.includes(r.name),
    }));

    return {
      totalRolesCount: allRoles.length,
      totalFilteredRolesCount: totalFilteredRoles,
      roles: mapped,
    };
  }

  async getRole(id: string) {
    const staticRoles = this.config.get<string[]>('KEYCLOAK_STATIC_ROLES');

    const role = await this.adminService.performAction((realm, client) =>
      client.roles.findOneById({ realm, id }),
    );

    if (!role) {
      throw new RoleServiceException(
        RoleServiceExceptionCode.ROLE_NOT_FOUND,
        'No role found',
      );
    }

    return {
      id: role.id,
      name: role.name,
      editable: !staticRoles.includes(role.name),
    };
  }

  async deleteRole(id: string) {
    const staticRoles = this.config.get<string[]>('KEYCLOAK_STATIC_ROLES');

    const role = await this.adminService.performAction((realm, client) =>
      client.roles.findOneById({ realm, id }),
    );

    if (!role) {
      throw new RoleServiceException(
        RoleServiceExceptionCode.ROLE_NOT_FOUND,
        'No role found',
      );
    }

    if (staticRoles.includes(role.name)) {
      throw new RoleServiceException(
        RoleServiceExceptionCode.ROLE_NOT_EDITABLE,
        'Role cannot be modified/deleted',
      );
    }

    return this.adminService.performAction((realm, client) =>
      client.roles.delById({ realm, id }),
    );
  }

  async createRole(name: string, description?: string) {
    return this.adminService.performAction((realm, client) =>
      client.roles.create({ realm, name, description }),
    );
  }

  async updateRole(id: string, name: string, description?: string) {
    const staticRoles = this.config.get<string[]>('KEYCLOAK_STATIC_ROLES');

    const role = await this.adminService.performAction((realm, client) =>
      client.roles.findOneById({ realm, id }),
    );

    if (!role) {
      throw new RoleServiceException(
        RoleServiceExceptionCode.ROLE_NOT_FOUND,
        'No role found',
      );
    }

    if (staticRoles.includes(role.name)) {
      throw new RoleServiceException(
        RoleServiceExceptionCode.ROLE_NOT_EDITABLE,
        'Role cannot be modified/deleted',
      );
    }

    const existingRoleWithName = await this.adminService.performAction(
      (realm, client) => client.roles.findOneByName({ realm, name }),
    );

    if (existingRoleWithName && existingRoleWithName.id !== id) {
      throw new RoleServiceException(
        RoleServiceExceptionCode.ROLE_DUPLICATE,
        'Role with this name already exists',
      );
    }

    return this.adminService.performAction((realm, client) =>
      client.roles.updateById({ realm, id }, { name, description }),
    );
  }
}

export enum RoleServiceExceptionCode {
  ROLE_NOT_FOUND = 1,
  ROLE_NOT_EDITABLE = 2,
  ROLE_DUPLICATE = 3,
}

export class RoleServiceException extends Error {
  constructor(code: RoleServiceExceptionCode, message: string) {
    super(message);

    this.code = code;
  }

  readonly code: RoleServiceExceptionCode;
}
