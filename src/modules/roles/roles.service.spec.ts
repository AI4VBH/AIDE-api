import { createMock, DeepMocked } from '@golevelup/ts-jest';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Roles } from '@keycloak/keycloak-admin-client/lib/resources/roles';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';
import { RoleServiceException, RolesService } from './roles.service';

type PerformActionParam = (
  realm: string,
  client: KeycloakAdminClient,
) => Promise<any>;

describe('RolesService', () => {
  let configServiceMock: DeepMocked<ConfigService>;
  let rolesMock: DeepMocked<Roles>;
  let keycloakAdminClientMock: DeepMocked<KeycloakAdminClient>;
  let keycloakAdminServiceMock: DeepMocked<KeycloakAdminService>;

  let service: RolesService;

  beforeEach(async () => {
    configServiceMock = createMock<ConfigService>();
    rolesMock = createMock<Roles>();
    keycloakAdminClientMock = createMock<KeycloakAdminClient>({
      roles: rolesMock,
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: KeycloakAdminService,
          useValue: keycloakAdminServiceMock,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllRoles', () => {
    it('calls the right service method', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.find.mockResolvedValue([
        { id: '4aa67f47-190f-4629-8f5a-e7025787cff9', name: 'admin' },
        { id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec', name: 'other-role' },
      ]);

      const expected = [
        {
          id: '4aa67f47-190f-4629-8f5a-e7025787cff9',
          name: 'admin',
          editable: false,
        },
        {
          id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec',
          name: 'other-role',
          editable: true,
        },
      ];

      const roles = await service.getAllRoles();

      expect(keycloakAdminServiceMock.performAction).toHaveBeenCalled();
      expect(keycloakAdminClientMock.auth).toHaveBeenCalled();
      expect(rolesMock.find).toHaveBeenCalledWith({
        realm: 'realm',
      });

      expect(roles).toStrictEqual(expected);
    });
  });

  describe('getAllRolesFiltered', () => {
    it('calls the right service methods', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.find.mockResolvedValue([
        { id: '4aa67f47-190f-4629-8f5a-e7025787cff9', name: 'admin' },
        { id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec', name: 'other-role' },
      ]);

      const expected = {
        totalRolesCount: 2,
        totalFilteredRolesCount: 2,
        roles: [
          {
            id: '4aa67f47-190f-4629-8f5a-e7025787cff9',
            name: 'admin',
            editable: false,
          },
          {
            id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec',
            name: 'other-role',
            editable: true,
          },
        ],
      };

      const roles = await service.getAllRolesFiltered(0, 5);

      expect(keycloakAdminServiceMock.performAction).toHaveBeenCalled();
      expect(keycloakAdminClientMock.auth).toHaveBeenCalled();
      expect(rolesMock.find).toHaveBeenCalledWith({
        realm: 'realm',
      });
      expect(rolesMock.find).toHaveBeenCalledWith({
        realm: 'realm',
        first: 0,
        max: 5,
      });
      expect(roles).toStrictEqual(expected);
    });

    it('sorting applied correctly', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.find.mockResolvedValue([
        { id: '4aa67f47-190f-4629-8f5a-e7025787cff9', name: 'admin' },
        { id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec', name: 'other-role' },
      ]);

      const expected = {
        totalRolesCount: 2,
        totalFilteredRolesCount: 2,
        roles: [
          {
            id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec',
            name: 'other-role',
            editable: true,
          },
          {
            id: '4aa67f47-190f-4629-8f5a-e7025787cff9',
            name: 'admin',
            editable: false,
          },
        ],
      };

      const roles = await service.getAllRolesFiltered(0, 5, '', 'name', true);

      expect(keycloakAdminServiceMock.performAction).toHaveBeenCalled();
      expect(keycloakAdminClientMock.auth).toHaveBeenCalled();
      expect(rolesMock.find).toHaveBeenCalledWith({
        realm: 'realm',
      });
      expect(rolesMock.find).toHaveBeenCalledWith({
        realm: 'realm',
        first: 0,
        max: 5,
        search: '',
      });
      expect(roles).toStrictEqual(expected);
    });
  });

  describe('getRole', () => {
    it('throws exception when role is not found', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue(null);

      await expect(service.getRole('guid')).rejects.toThrow(
        RoleServiceException,
      );
    });

    it.each(['admin', 'other'])(
      'returns expected result when role is `%s`',
      async (name: string) => {
        const staticRoles = ['admin'];
        configServiceMock.get.mockImplementation(
          (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && staticRoles,
        );

        rolesMock.findOneById.mockResolvedValue({
          id: 'bb10b4db-b143-42db-bb21-49b97cc1a61f',
          name,
        });

        const result = await service.getRole(
          'bb10b4db-b143-42db-bb21-49b97cc1a61f',
        );

        expect(result.name).toEqual(name);
        expect(result.editable).toEqual(!staticRoles.includes(name));
      },
    );
  });

  describe('deleteRole', () => {
    it('throws exception when role is not found', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue(null);

      await expect(service.deleteRole('guid')).rejects.toThrow(
        RoleServiceException,
      );
    });

    it('throws exception when deleting non editable roles', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue({
        id: '4aa67f47-190f-4629-8f5a-e7025787cff9',
        name: 'admin',
      });

      await expect(service.deleteRole('guid')).rejects.toThrow(
        RoleServiceException,
      );
    });

    it('calls expected methods', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue({
        id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec',
        name: 'other-role',
      });

      await service.deleteRole('guid');

      expect(keycloakAdminServiceMock.performAction).toHaveBeenCalled();
      expect(keycloakAdminClientMock.auth).toHaveBeenCalled();
      expect(rolesMock.findOneById).toHaveBeenCalledWith({
        realm: 'realm',
        id: 'guid',
      });
      expect(rolesMock.delById).toHaveBeenCalledWith({
        realm: 'realm',
        id: 'guid',
      });
    });
  });

  describe('createRole', () => {
    it.each([
      ['name', undefined],
      ['name', null],
      ['name', ''],
      ['name', 'description'],
    ])('calls the expected methods', async (name, description) => {
      await service.createRole(name, description);

      expect(keycloakAdminServiceMock.performAction).toHaveBeenCalled();
      expect(keycloakAdminClientMock.auth).toHaveBeenCalled();
      expect(rolesMock.create).toHaveBeenCalledWith({
        realm: 'realm',
        name,
        description,
      });
    });
  });

  describe('updateRole', () => {
    it('throws exception when role is not found', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue(null);

      await expect(service.updateRole('guid', 'name')).rejects.toThrow(
        RoleServiceException,
      );
    });

    it('throws exception when deleting non editable roles', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue({
        id: '4aa67f47-190f-4629-8f5a-e7025787cff9',
        name: 'admin',
      });

      await expect(service.updateRole('guid', 'name')).rejects.toThrow(
        RoleServiceException,
      );
    });

    it('calls expected methods', async () => {
      configServiceMock.get.mockImplementation(
        (key: string) => key === 'KEYCLOAK_STATIC_ROLES' && ['admin'],
      );

      rolesMock.findOneById.mockResolvedValue({
        id: '9da87ef1-e7dc-42e1-b409-89a3e13735ec',
        name: 'other-role',
      });

      await service.updateRole('guid', 'name');

      expect(keycloakAdminServiceMock.performAction).toHaveBeenCalled();
      expect(keycloakAdminClientMock.auth).toHaveBeenCalled();
      expect(rolesMock.findOneById).toHaveBeenCalledWith({
        realm: 'realm',
        id: 'guid',
      });
      expect(rolesMock.updateById).toHaveBeenCalledWith(
        {
          realm: 'realm',
          id: 'guid',
        },
        { name: 'name' },
      );
    });
  });
});
