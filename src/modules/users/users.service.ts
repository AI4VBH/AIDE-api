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
    search?: string,
    sortBy?: string,
    sortDesc?: boolean,
  ): Promise<UserPage> {
    const userPage: UserPage = {
      totalUserCount: 0,
      totalFilteredUserCount: 0,
      users: [],
    };

    userPage.totalUserCount = await this.getUserCount();

    if (search) {
      userPage.totalFilteredUserCount = await this.getUserCount(search);
    } else {
      userPage.totalFilteredUserCount = userPage.totalUserCount;
    }

    let users = await this.adminService.performAction((realm, client) =>
      client.users.find({
        realm,
        search,
        first,
        max,
      }),
    );

    if (sortBy) {
      users = users.sort((a, b) => {
        const sortA = a[sortBy];
        const sortB = b[sortBy];

        if (sortDesc) {
          return sortA === sortB ? 0 : sortA < sortB ? 1 : -1;
        }

        return sortA === sortB ? 0 : sortA > sortB ? 1 : -1;
      });
    }

    for (const user of users) {
      const userRoles = await this.getUserRoles(user.id);

      userPage.users.push(User.formatUserDetails(user, userRoles));
    }

    return userPage;
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
    userRoles: { id: string; name: string }[],
  ): Promise<void> {
    return await this.adminService.performAction((realm, client) =>
      client.users.addRealmRoleMappings({
        realm,
        id: userId,
        roles: userRoles,
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
    await this.addRolesToUser(userId, user.realmRoles);

    return await this.getUser(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    return await this.adminService.performAction((realm, client) =>
      client.users.del({ realm, id: userId }),
    );
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
