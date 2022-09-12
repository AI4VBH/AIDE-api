import { createMock, DeepMocked } from '@golevelup/ts-jest';
import * as userMock from './__mocks__/user.json';
import * as userRepresentationMock from './__mocks__/user-representation.json';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Users } from '@keycloak/keycloak-admin-client/lib/resources/users';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAdminService } from '../../shared/keycloak-admin/keycloak-admin.service';
import { User, UserPage } from './user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let clientMock: DeepMocked<KeycloakAdminClient>;
  let usersMock: DeepMocked<Users>;
  let adminKeycloakService: DeepMocked<KeycloakAdminService>;
  let service: UsersService;

  beforeEach(async () => {
    usersMock = createMock<Users>();
    clientMock = createMock<KeycloakAdminClient>({ users: usersMock });

    adminKeycloakService = createMock<KeycloakAdminService>({
      adminClient: clientMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: KeycloakAdminService,
          useValue: adminKeycloakService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should call client with get users command', async () => {
      (clientMock.users as DeepMocked<Users>).find.mockResolvedValue([
        userRepresentationMock,
      ]);
      (clientMock.users as DeepMocked<Users>).count.mockResolvedValue(1);
      (
        clientMock.users as DeepMocked<Users>
      ).listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);

      const userPage: UserPage = await service.getUsers(0, 1, '', '', false);

      expect(clientMock.users.find).toHaveBeenCalled();
      expect(clientMock.users.count).toHaveBeenCalled();
      expect(clientMock.users.listRealmRoleMappings).toHaveBeenCalledTimes(
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
      (clientMock.users as DeepMocked<Users>).findOne.mockResolvedValue(
        userRepresentationMock,
      );
      (
        clientMock.users as DeepMocked<Users>
      ).listRealmRoleMappings.mockResolvedValue([
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

      expect(clientMock.users.findOne).toHaveBeenCalled();
      expect(clientMock.users.listRealmRoleMappings).toHaveBeenCalled();
      expect(user).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should call client with create user command', async () => {
      (clientMock.users as DeepMocked<Users>).create.mockResolvedValue({
        id: '6f917038-147e-4e0b-8a1a-255c42906ae7',
      });
      (
        clientMock.users as DeepMocked<Users>
      ).addRealmRoleMappings.mockResolvedValue();
      (
        clientMock.users as DeepMocked<Users>
      ).listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);
      (clientMock.users as DeepMocked<Users>).findOne.mockResolvedValue(
        userRepresentationMock,
      );
      const userBody = {
        first_name: 'username',
        last_name: 'usersurname',
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

      expect(clientMock.users.findOne).toHaveBeenCalled();
      expect(clientMock.users.addRealmRoleMappings).toHaveBeenCalled();
      expect(clientMock.users.create).toHaveBeenCalled();
      expect(clientMock.users.listRealmRoleMappings).toHaveBeenCalled();
      expect(user).toEqual(userMock);
    });
  });

  describe('updateUser', () => {
    it('should call client with update user command', async () => {
      (clientMock.users as DeepMocked<Users>).update.mockResolvedValue();
      (
        clientMock.users as DeepMocked<Users>
      ).addRealmRoleMappings.mockResolvedValue();
      (
        clientMock.users as DeepMocked<Users>
      ).listRealmRoleMappings.mockResolvedValue([
        {
          id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
          name: 'default-roles-demo-realm',
        },
        {
          id: '9600228a-98fc-47e0-a674-054ba13e4bae',
          name: 'admin',
        },
      ]);
      (clientMock.users as DeepMocked<Users>).findOne.mockResolvedValue(
        userRepresentationMock,
      );
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';
      const userBody = {
        first_name: 'username',
        last_name: 'usersurname',
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

      expect(clientMock.users.findOne).toHaveBeenCalled();
      expect(clientMock.users.addRealmRoleMappings).toHaveBeenCalled();
      expect(clientMock.users.update).toHaveBeenCalled();
      expect(clientMock.users.listRealmRoleMappings).toHaveBeenCalled();
      expect(user).toEqual(userMock);
    });
  });

  describe('deleteUser', () => {
    it('should call client with delete user command', async () => {
      (clientMock.users as DeepMocked<Users>).del.mockResolvedValue();
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      await service.deleteUser(userId);

      expect(clientMock.users.del).toHaveBeenCalled();
    });
  });

  describe('addRolesToUser', () => {
    it('should call client with add roles to user command', async () => {
      (
        clientMock.users as DeepMocked<Users>
      ).addRealmRoleMappings.mockResolvedValue();
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

      expect(clientMock.users.addRealmRoleMappings).toHaveBeenCalled();
    });
  });

  describe('getUserRoles', () => {
    it('should call client with get user roles command', async () => {
      (
        clientMock.users as DeepMocked<Users>
      ).listRealmRoleMappings.mockResolvedValue([]);
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      await service.getUserRoles(userId);

      expect(clientMock.users.listRealmRoleMappings).toHaveBeenCalled();
    });
  });

  describe('getUserCount', () => {
    it('should call client with get user count command', async () => {
      (clientMock.users as DeepMocked<Users>).count.mockResolvedValue(1);

      const response = await service.getUserCount();

      expect(clientMock.users.count).toHaveBeenCalled();
      expect(response).toEqual(1);
    });
  });
});
