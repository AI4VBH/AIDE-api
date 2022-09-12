import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Inject, Injectable } from '@nestjs/common';
import { KeycloakAdminService } from '../../shared/keycloak-admin/keycloak-admin.service';
import { User, UserPage, UserRole } from './user.dto';

@Injectable()
export class UsersService {
  @Inject()
  private readonly keycloakAdminService: KeycloakAdminService;

  async getUsers(
    first: number,
    max: number,
    search?: string,
    sortBy?: string,
    sortDesc?: boolean,
  ): Promise<UserPage> {
    await this.keycloakAdminService.setupKeycloakAdmin();

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

    const users: UserRepresentation[] =
      await this.keycloakAdminService.adminClient.users.find({
        realm: process.env.KEYCLOAK_REALM,
        search: search,
        sortBy: sortBy,
        sortDesc: sortDesc,
        first: first,
        max: max,
      });

    for (let i = 0; i < users.length; i++) {
      const userRoles = await this.getUserRoles(users[i].id);
      const user = User.formatUserDetails(users[i], userRoles);
      userPage.users.push(user);
    }

    return userPage;
  }

  async getUserCount(search?: string): Promise<number> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    return this.keycloakAdminService.adminClient.users.count({
      realm: process.env.KEYCLOAK_REALM,
      search: search,
    });
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    const userRoleObjects =
      await this.keycloakAdminService.adminClient.users.listRealmRoleMappings({
        realm: process.env.KEYCLOAK_REALM,
        id: userId,
      });

    return userRoleObjects.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  async getUser(userId: string): Promise<User> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    const user = await this.keycloakAdminService.adminClient.users.findOne({
      realm: process.env.KEYCLOAK_REALM,
      id: userId,
    });

    const userRoles = await this.getUserRoles(user.id);

    return User.formatUserDetails(user as UserRepresentation, userRoles);
  }

  async addRolesToUser(
    userId: string,
    userRoles: { id: string; name: string }[],
  ): Promise<void> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    return await this.keycloakAdminService.adminClient.users.addRealmRoleMappings(
      {
        realm: process.env.KEYCLOAK_REALM,
        id: userId,
        roles: userRoles,
      },
    );
  }

  async createUser(user: User): Promise<User> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    const newUser = await this.keycloakAdminService.adminClient.users.create({
      realm: process.env.KEYCLOAK_REALM,
      username: user.email,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      enabled: user.enabled,
    });
    await this.addRolesToUser(newUser.id, user.realmRoles);
    return await this.getUser(newUser.id);
  }

  async updateUser(userId: string, user: User): Promise<User> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    await this.keycloakAdminService.adminClient.users.update(
      {
        id: userId,
        realm: process.env.KEYCLOAK_REALM,
      },
      {
        username: user.email,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        enabled: user.enabled,
      },
    );
    await this.addRolesToUser(userId, user.realmRoles);

    return await this.getUser(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.keycloakAdminService.setupKeycloakAdmin();

    return await this.keycloakAdminService.adminClient.users.del({
      id: userId,
      realm: process.env.KEYCLOAK_REALM,
    });
  }
}
