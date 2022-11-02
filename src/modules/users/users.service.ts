import RoleRepresentation, {
  RoleMappingPayload,
} from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Inject, Injectable } from '@nestjs/common';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { User, UserPage, UserRole } from './user.dto';

@Injectable()
export class UsersService {
  @Inject()
  private readonly adminService: KeycloakAdminService;

  async getUsers(
    first: number,
    max: number,
    role?: string,
    search?: string,
    sortBy?: string,
    sortDesc?: boolean,
  ): Promise<UserPage> {
    if (role) {
      return await this.getPagedUsersInRole(
        first,
        max,
        role,
        search,
        sortBy,
        sortDesc,
      );
    }

    return await this.getPagedUsers(first, max, search, sortBy, sortDesc);
  }

  async getUserCount(search?: string): Promise<number> {
    return await this.adminService.performAction((realm, client) =>
      client.users.count({ realm, search }),
    );
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const userRoleObjects = await this.adminService.performAction(
      (realm, client) =>
        client.users.listRealmRoleMappings({ realm, id: userId }),
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
    sortBy?: string,
    sortDesc?: boolean,
  ): Promise<UserPage> {
    let users = await this.adminService.performAction((realm, client) =>
      client.roles.findUsersWithRole({ realm, name: roleName }),
    );

    const totalUserCount = await this.getUserCount();
    let totalFilteredUserCount = users.length;

    if (sortBy) {
      users.sort((a, b) => {
        const sortA = a[sortBy].toLocaleLowerCase();
        const sortB = b[sortBy].toLocaleLowerCase();

        if (sortDesc) {
          return sortA === sortB ? 0 : sortA < sortB ? 1 : -1;
        }

        return sortA === sortB ? 0 : sortA > sortB ? 1 : -1;
      });
    }

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
    sortBy?: string,
    sortDesc?: boolean,
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

    if (sortBy) {
      users.sort((a, b) => {
        const sortA = a[sortBy].toLocaleLowerCase();
        const sortB = b[sortBy].toLocaleLowerCase();

        if (sortDesc) {
          return sortA === sortB ? 0 : sortA < sortB ? 1 : -1;
        }

        return sortA === sortB ? 0 : sortA > sortB ? 1 : -1;
      });
    }

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
