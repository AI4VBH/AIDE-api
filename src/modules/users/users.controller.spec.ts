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
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as userMock from './__mocks__/user.json';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

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
    it.each([
      [-1, 5],
      [0, -1],
      [-1, -1],
    ])(
      'throws exception if first/max are negative. first: %s, max: %s',
      async (first, max) => {
        const action = async () =>
          await controller.getUsers(first, max, '', '');

        await expect(action).rejects.toThrow(BadRequestException);
      },
    );

    it('should return paginated list of users', async () => {
      service.getUsers.mockResolvedValue({
        totalUserCount: 5,
        totalFilteredUserCount: 5,
        users: [userMock],
      });

      const response = await controller.getUsers(0, 1, '', '');

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

    const response = await controller.getUsers(0, 1, '', 'user');

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
        firstName: 'username',
        lastName: 'usersurname',
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
        firstName: 'username',
        lastName: 'usersurname',
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
