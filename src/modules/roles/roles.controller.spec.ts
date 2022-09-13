import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let service: DeepMocked<RolesService>;
  let controller: RolesController;

  beforeEach(async () => {
    service = createMock<RolesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllRolesFiltered', () => {
    it('calls the correct service method', async () => {
      await controller.getAllFiltered(0, 5, '');

      expect(service.getAllRolesFiltered).toHaveBeenCalled();
    });
  });

  describe('getRole', () => {
    it('calls the correct service method', async () => {
      await controller.getRole('5b8ff697-7cd7-43fd-846c-fd6e36d9e96f');

      expect(service.getRole).toBeCalledWith(
        '5b8ff697-7cd7-43fd-846c-fd6e36d9e96f',
      );
    });
  });

  describe('deleteRole', () => {
    it('calls the correct service method', async () => {
      await controller.deleteRole('5b8ff697-7cd7-43fd-846c-fd6e36d9e96f');

      expect(service.deleteRole).toBeCalledWith(
        '5b8ff697-7cd7-43fd-846c-fd6e36d9e96f',
      );
    });
  });

  describe('createRole', () => {
    it.each([
      ['name', 'description'],
      ['name', undefined],
      ['name', null],
      ['name', ''],
    ])(
      'calls the correct service method with %s',
      async (name: string, description?: string) => {
        await controller.createRole({
          name,
          description,
        });

        expect(service.createRole).toHaveBeenCalledWith(name, description);
      },
    );
  });

  describe('updateRole', () => {
    it.each([
      ['name', 'description'],
      ['name', undefined],
      ['name', null],
      ['name', ''],
    ])(
      'calls the correct service method with %s',
      async (name: string, description?: string) => {
        await controller.updateRole('9186d5d1-19b3-49e8-ba24-100c6e697ffc', {
          name,
          description,
        });

        expect(service.updateRole).toHaveBeenCalledWith(
          '9186d5d1-19b3-49e8-ba24-100c6e697ffc',
          name,
          description,
        );
      },
    );
  });
});
