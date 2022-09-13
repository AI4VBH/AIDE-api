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

    const roles = await this.adminService.performAction((realm, client) =>
      client.roles.find({ realm }),
    );

    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      editable: !staticRoles.includes(r.name),
    }));
  }

  async getAllRolesFiltered(
    first: number,
    max: number,
    search?: string,
    sortBy?: string,
    sortDesc?: boolean,
  ) {
    const staticRoles = this.config.get<string[]>('KEYCLOAK_STATIC_ROLES');

    const allRoles = await this.adminService.performAction((realm, client) =>
      client.roles.find({ realm }),
    );

    let filteredRoles = await this.adminService.performAction((realm, client) =>
      client.roles.find({ realm, search, first, max }),
    );

    if (sortBy) {
      filteredRoles = filteredRoles.sort((a, b) => {
        const sortA = a[sortBy];
        const sortB = b[sortBy];

        if (sortDesc) {
          return sortA === sortB ? 0 : sortA < sortB ? 1 : -1;
        }

        return sortA === sortB ? 0 : sortA > sortB ? 1 : -1;
      });
    }

    const mapped = filteredRoles.map((r) => ({
      id: r.id,
      name: r.name,
      editable: !staticRoles.includes(r.name),
    }));

    return {
      totalRolesCount: allRoles.length,
      totalFilteredRolesCount: mapped.length,
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

    return this.adminService.performAction((realm, client) =>
      client.roles.updateById({ realm, id }, { name, description }),
    );
  }
}

export enum RoleServiceExceptionCode {
  ROLE_NOT_FOUND = 1,
  ROLE_NOT_EDITABLE = 2,
}

export class RoleServiceException extends Error {
  constructor(code: RoleServiceExceptionCode, message: string) {
    super(message);

    this.code = code;
  }

  readonly code: RoleServiceExceptionCode;
}
