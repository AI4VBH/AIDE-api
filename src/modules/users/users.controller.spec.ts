import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as userMock from './__mocks__/user.json';
import { KeycloakAdminService } from '../../shared/keycloak-admin/keycloak-admin.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let kcAdminService: DeepMocked<KeycloakAdminService>;
  let configService: DeepMocked<ConfigService>;
  let service: DeepMocked<UsersService>;
  let controller: UsersController;

  beforeEach(async () => {
    service = createMock<UsersService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: service },
        { provide: ConfigService, useValue: configService },
        { provide: KeycloakAdminService, useValue: kcAdminService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return paginated list of users', async () => {
      service.getUsers.mockResolvedValue({
        totalUserCount: 5,
        totalFilteredUserCount: 5,
        users: [userMock],
      });

      const response = await controller.getUsers(0, 1, '', '', false);

      expect(response).toEqual({
        totalUserCount: 5,
        totalFilteredUserCount: 5,
        users: [userMock],
      });
    });
  });

  it('should return expected result with search query param passed in', async () => {
    service.getUsers.mockResolvedValue({
      totalUserCount: 5,
      totalFilteredUserCount: 1,
      users: [userMock],
    });

    const response = await controller.getUsers(0, 1, 'user', '', false);

    expect(response).toEqual({
      totalUserCount: 5,
      totalFilteredUserCount: 1,
      users: [userMock],
    });
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      service.getUser.mockResolvedValue(userMock);
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      const response = await controller.getUser(userId);

      expect(response).toEqual(userMock);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      service.createUser.mockResolvedValue(userMock);
      const userBody = {
        first_name: 'username',
        last_name: 'usersurname',
        email: 'eemail@email.com',
        enabled: true,
        realmRoles: [
          {
            id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
            name: 'default-roles-demo-realm',
          },
        ],
      };

      const response = await controller.createUser(userBody);

      expect(response).toEqual(userMock);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      service.updateUser.mockResolvedValue(userMock);
      const userBody = {
        first_name: 'username',
        last_name: 'usersurname',
        email: 'eemail@email.com',
        enabled: true,
        realmRoles: [
          {
            id: '5fb3fe2e-cce2-4fab-b84b-c0b1e31a273f',
            name: 'default-roles-demo-realm',
          },
        ],
      };
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      const response = await controller.updateUser(userId, userBody);

      expect(response).toEqual(userMock);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      service.deleteUser.mockResolvedValue();
      const userId = '6f917038-147e-4e0b-8a1a-255c42906ae7';

      const response = await controller.deleteUser(userId);

      expect(response).toBeUndefined();
    });
  });
});
