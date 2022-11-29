/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

import { createMock, DeepMocked } from '@golevelup/ts-jest';
import * as userMock from './__mocks__/user.json';
import * as userRepresentationMock from './__mocks__/user-representation.json';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Users } from '@keycloak/keycloak-admin-client/lib/resources/users';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { User, UserPage } from './user.dto';
import { UsersService } from './users.service';

type PerformActionParam = (
  realm: string,
  client: KeycloakAdminClient,
) => Promise<any>;

describe('UsersService', () => {
  let configServiceMock: DeepMocked<ConfigService>;
  let usersMock: DeepMocked<Users>;
  let keycloakAdminClientMock: DeepMocked<KeycloakAdminClient>;
  let keycloakAdminServiceMock: DeepMocked<KeycloakAdminService>;

  let service: UsersService;

  beforeEach(async () => {
    configServiceMock = createMock<ConfigService>();
    usersMock = createMock<Users>();
    keycloakAdminClientMock = createMock<KeycloakAdminClient>({
      users: usersMock,
    });

    keycloakAdminServiceMock = createMock<KeycloakAdminService>({
      adminClient: keycloakAdminClientMock,
      performAction: async (action: PerformActionParam) => {
        await keycloakAdminClientMock.auth({
          grantType: 'client_credentials',
          clientId: 'some-id',
          clientSecret: 'som-secret',
        });
        return await action('realm', keycloakAdminClientMock);
      },
    });

    configServiceMock.get.mockImplementation((key: string) => {
      switch (key) {
        case 'KEYCLOAK_STATIC_ROLES':
          return ['admin'];
        case 'KEYCLOAK_EXCLUSION_ROLES':
          return ['default-roles-aide'];
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: KeycloakAdminService,
          useValue: keycloakAdminServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should call client with get users command', async () => {
      usersMock.find.mockResolvedValue([userRepresentationMock]);
      usersMock.count.mockResolvedValue(1);
      usersMock.listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);

      const userPage: UserPage = await service.getUsers(0, 1, '', '');

      expect(usersMock.find).toHaveBeenCalled();
      expect(usersMock.count).toHaveBeenCalled();
      expect(usersMock.listRealmRoleMappings).toHaveBeenCalledTimes(
        userPage.users.length,
      );
      expect(userPage).toEqual({
        totalUserCount: 1,
        totalFilteredUserCount: 1,
        users: [userMock],
      });
    });
  });

  describe('getUser', () => {
    it('should call client with get user command', async () => {
      usersMock.findOne.mockResolvedValue(userRepresentationMock);
      usersMock.listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      const user: User = await service.getUser(userId);

      expect(usersMock.findOne).toHaveBeenCalled();
      expect(usersMock.listRealmRoleMappings).toHaveBeenCalled();
      expect(user).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should call client with create user command', async () => {
      usersMock.create.mockResolvedValue({
        id: '6f917038-147e-4e0b-8a1a-255c42906ae7',
      });
      usersMock.addRealmRoleMappings.mockResolvedValue();
      usersMock.listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);
      usersMock.findOne.mockResolvedValue(userRepresentationMock);
      const userBody = {
        firstName: 'username',
        lastName: 'usersurname',
        email: 'eemail@email.com',
        realmRoles: [
          {
            id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
            name: 'default-roles-demo-realm',
          },
          {
            id: '9600228a-98fc-47e0-a674-054ba13e4bae',
            name: 'admin',
          },
        ],
        enabled: true,
      };

      const user: User = await service.createUser(userBody as User);

      expect(usersMock.findOne).toHaveBeenCalled();
      expect(usersMock.addRealmRoleMappings).toHaveBeenCalled();
      expect(usersMock.create).toHaveBeenCalled();
      expect(usersMock.listRealmRoleMappings).toHaveBeenCalled();
      expect(user).toEqual(userMock);
    });
  });

  describe('updateUser', () => {
    it('should call client with update user command', async () => {
      usersMock.update.mockResolvedValue();
      usersMock.delRealmRoleMappings.mockResolvedValue();
      usersMock.addRealmRoleMappings.mockResolvedValue();
      usersMock.listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);
      usersMock.findOne.mockResolvedValue(userRepresentationMock);
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';
      const userBody = {
        firstName: 'username',
        lastName: 'usersurname',
        email: 'eemail@email.com',
        realmRoles: [
          {
            id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
            name: 'default-roles-demo-realm',
          },
          {
            id: '9600228a-98fc-47e0-a674-054ba13e4bae',
            name: 'admin',
          },
        ],
        enabled: true,
      };

      const user: User = await service.updateUser(userId, userBody as User);

      expect(usersMock.findOne).toHaveBeenCalled();
      expect(usersMock.delRealmRoleMappings).toHaveBeenCalled();
      expect(usersMock.addRealmRoleMappings).toHaveBeenCalled();
      expect(usersMock.update).toHaveBeenCalled();
      expect(usersMock.listRealmRoleMappings).toHaveBeenCalled();
      expect(user).toEqual(userMock);
    });
  });

  describe('deleteUser', () => {
    it('should call client with delete user command', async () => {
      usersMock.del.mockResolvedValue();
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      await service.deleteUser(userId);

      expect(usersMock.del).toHaveBeenCalled();
    });
  });

  describe('addRolesToUser', () => {
    it('should call client with add roles to user command', async () => {
      usersMock.addRealmRoleMappings.mockResolvedValue();
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';
      const userRoles = [
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ];

      await service.addRolesToUser(userId, userRoles);

      expect(usersMock.addRealmRoleMappings).toHaveBeenCalled();
    });
  });

  describe('getUserRoles', () => {
    it('should call client with get user roles command', async () => {
      usersMock.listRealmRoleMappings.mockResolvedValue([]);
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      await service.getUserRoles(userId);

      expect(usersMock.listRealmRoleMappings).toHaveBeenCalled();
    });
  });

  describe('getFilteredUserRoles', () => {
    it('should call client with get user roles command but the default-roles-aid filtered out', async () => {
      usersMock.listRealmRoleMappings.mockResolvedValue([
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
        {
          id: '5feb95d0-b672-4f8c-a7bc-51f2742c0037',
          name: 'default-roles-aide',
        },
      ]);
      usersMock.findOne.mockResolvedValue(userRepresentationMock);
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';
      const userMockExpectedRoles = [
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ];

      const userRoles = await service.getUserRoles(userId);

      expect(usersMock.listRealmRoleMappings).toHaveBeenCalled();
      expect(userRoles).toEqual(userMockExpectedRoles);
    });
  });

  describe('getUserCount', () => {
    it('should call client with get user count command', async () => {
      usersMock.count.mockResolvedValue(1);

      const response = await service.getUserCount();

      expect(usersMock.count).toHaveBeenCalled();
      expect(response).toEqual(1);
    });
  });
});
