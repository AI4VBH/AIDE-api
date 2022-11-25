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

import RoleRepresentation, {
  RoleMappingPayload,
} from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Users } from '@keycloak/keycloak-admin-client/lib/resources/users';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { User, UserPage, UserRole } from './user.dto';

@Injectable()
export class UsersService {
  @Inject()
  private readonly adminService: KeycloakAdminService;

  @Inject(ConfigService)
  private readonly config: ConfigService;

  async getUsers(
    first: number,
    max: number,
    role?: string,
    search?: string,
  ): Promise<UserPage> {
    if (role) {
      return await this.getPagedUsersInRole(first, max, role, search);
    }

    return await this.getPagedUsers(first, max, search);
  }

  async getUserCount(search?: string): Promise<number> {
    return await this.adminService.performAction((realm, client) =>
      client.users.count({ realm, search }),
    );
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    let userRoleObjects = await this.adminService.performAction(
      (realm, client) =>
        client.users.listRealmRoleMappings({ realm, id: userId }),
    );

    const exclusionRoles = this.config.get<string[]>(
      'KEYCLOAK_EXCLUSION_ROLES',
    );

    userRoleObjects = userRoleObjects.filter(
      (role) => !exclusionRoles.includes(role.name),
    );

    return userRoleObjects.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.adminService.performAction((realm, client) =>
      client.users.findOne({
        realm,
        id: userId,
      }),
    );

    if (!user) {
      throw new UserServiceException(
        UserServiceExceptionCode.USER_NOT_FOUND,
        'User not found',
      );
    }

    const userRoles = await this.getUserRoles(user.id);

    return User.formatUserDetails(user as UserRepresentation, userRoles);
  }

  async addRolesToUser(
    userId: string,
    userRoles: { id: string; name: string }[] = [],
  ): Promise<void> {
    return await this.adminService.performAction((realm, client) =>
      client.users.addRealmRoleMappings({
        realm,
        id: userId,
        roles: userRoles.map((ur) => ({ id: ur.id, name: ur.name })),
      }),
    );
  }

  async listUserRoles(userId: string): Promise<RoleRepresentation[]> {
    return await this.adminService.performAction((realm, client) =>
      client.users.listRealmRoleMappings({
        realm,
        id: userId,
      }),
    );
  }

  async deleteRolesFromUser(
    userId: string,
    userRoles: RoleRepresentation[] = [],
  ): Promise<void> {
    return await this.adminService.performAction((realm, client) =>
      client.users.delRealmRoleMappings({
        realm,
        id: userId,
        roles: userRoles as RoleMappingPayload[],
      }),
    );
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.adminService.performAction((realm, client) =>
      client.users.create({
        realm,
        username: user.email,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        enabled: user.enabled,
      }),
    );

    await this.addRolesToUser(newUser.id, user.realmRoles);

    return await this.getUser(newUser.id);
  }

  async updateUser(userId: string, user: User): Promise<User> {
    const existingUserRoles = await this.listUserRoles(userId);
    await this.adminService.performAction((realm, client) =>
      client.users.update(
        {
          realm,
          id: userId,
        },
        {
          username: user.email,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enabled: user.enabled,
        },
      ),
    );
    await this.deleteRolesFromUser(userId, existingUserRoles);
    await this.addRolesToUser(userId, user.realmRoles);

    return await this.getUser(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    return await this.adminService.performAction((realm, client) =>
      client.users.del({ realm, id: userId }),
    );
  }

  private async getPagedUsersInRole(
    first: number,
    max: number,
    roleName: string,
    search?: string,
  ): Promise<UserPage> {
    let users = await this.adminService.performAction((realm, client) =>
      client.roles.findUsersWithRole({ realm, name: roleName }),
    );

    const totalUserCount = await this.getUserCount();
    let totalFilteredUserCount = users.length;

    if (search) {
      const searchText = search.toLocaleLowerCase();

      users = users.filter(
        (u) =>
          u.email.toLocaleLowerCase().includes(searchText) ||
          u.firstName.toLocaleLowerCase().includes(searchText) ||
          u.lastName.toLocaleLowerCase().includes(searchText),
      );

      totalFilteredUserCount = users.length;
    }

    const paged = users.slice(first, first + max);
    const userDto: User[] = [];

    for (const user of paged) {
      const userRoles = await this.getUserRoles(user.id);

      userDto.push(User.formatUserDetails(user, userRoles));
    }

    return {
      totalUserCount,
      totalFilteredUserCount,
      users: userDto,
    };
  }

  private async getPagedUsers(
    first: number,
    max: number,
    search?: string,
  ): Promise<UserPage> {
    const totalUserCount = await this.getUserCount();
    let totalFilteredUserCount = totalUserCount;

    if (search) {
      totalFilteredUserCount = await this.getUserCount(search);
    }

    const users = await this.adminService.performAction((realm, client) =>
      client.users.find({
        realm,
        search,
        first,
        max,
      }),
    );

    const userDto: User[] = [];

    for (const user of users) {
      const userRoles = await this.getUserRoles(user.id);

      userDto.push(User.formatUserDetails(user, userRoles));
    }

    return {
      totalUserCount,
      totalFilteredUserCount,
      users: userDto,
    };
  }
}

export enum UserServiceExceptionCode {
  USER_NOT_FOUND = 1,
}

export class UserServiceException extends Error {
  constructor(code: UserServiceExceptionCode, message: string) {
    super(message);

    this.code = code;
  }

  readonly code: UserServiceExceptionCode;
}
