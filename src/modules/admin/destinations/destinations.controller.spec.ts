import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsController } from './destinations.controller';
import { IDestination } from './destinations.interface';
import { DestinationsService } from './destinations.service';

describe('DestinationsController', () => {
  let controller: DestinationsController;
  let destinationsService: DeepMocked<DestinationsService>;

  beforeEach(async () => {
    destinationsService = createMock<DestinationsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationsController],
      providers: [
        {
          provide: DestinationsService,
          useValue: destinationsService,
        },
      ],
    }).compile();

    controller = module.get<DestinationsController>(DestinationsController);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  describe('getDestinations', () => {
    it('calls the correct service method', async () => {
      await controller.getDestinations();

      expect(destinationsService.getDestinations).toHaveBeenCalledTimes(1);
    });
  });

  describe('echoDestination', () => {
    it('returns the expected valid response', async () => {
      const expectedResponse = {
        status: 200,
      };

      destinationsService.echoDestination.mockResolvedValue({
        status: 200,
      });

      const response = await controller.echoDestination('test');

      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('deleteDestination', () => {
    it('returns expected result', async () => {
      const expectedResponse = { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp', name: 'lillie' }
      destinationsService.deleteDestination.mockResolvedValue(expectedResponse);
      const response = await controller.deleteDestination('lillie');
      expect(response).toStrictEqual(expectedResponse)
    });
  });

  describe('registerDestinations', () => {
    it.each([
      { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp', name: '' },
      { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp', name: null },
      { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp' },
      { aeTitle: 'aeTitle', port: 1234, hostIp: null, name: '' },
    ])(
      'throws a bad request if properties of the destination are not specified: %s',
      async (destination: IDestination) => {
        const action = async () =>
          await controller.registerDestination(destination);

        await expect(action()).rejects.toThrowError(BadRequestException);
      },
    );

    it("throws a bad request if the destination body isn't defined", async () => {
      const action = async () => await controller.registerDestination(null);

      await expect(action()).rejects.toThrowError(BadRequestException);
    });

    it('passes the destination through to the service', async () => {
      const body = {
        aeTitle: 'testing ae title',
        port: 3456,
        hostIp: 'example.host.ip',
        name: 'example name',
      };

      await controller.registerDestination(body);

      expect(destinationsService.registerDestination).toHaveBeenCalledWith(
        body,
      );
    });

    it('returns the expected valid response', async () => {
      const expectedResult = {
        aeTitle: 'testing ae title',
        port: 3456,
        hostIp: 'example.host.ip',
        name: 'example name',
      };

      destinationsService.registerDestination.mockResolvedValue(expectedResult);

      const response = await controller.registerDestination({
        aeTitle: 'testing ae title',
        port: 3456,
        hostIp: 'example.host.ip',
        name: 'example name',
      });

      expect(response).toStrictEqual(expectedResult);
    });
  });

  describe('updateDestination', () => {
    it.each([
      { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp', name: '' },
      { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp', name: null },
      { aeTitle: 'aeTitle', port: 1234, hostIp: 'hostIp' },
      { aeTitle: 'aeTitle', port: 1234, hostIp: null, name: '' },
    ])(
      'throws a bad request if properties of the destination are not specified: %s',
      async (destination: IDestination) => {
        const action = async () =>
          await controller.registerDestination(destination);

        await expect(action()).rejects.toThrowError(BadRequestException);
      },
    );

    it("throws a bad request if the destination body isn't defined", async () => {
      const action = async () => await controller.registerDestination(null);

      await expect(action()).rejects.toThrowError(BadRequestException);
    });

    it('passes the destination through to the service', async () => {
      const body = {
        aeTitle: 'testing ae title',
        port: 3456,
        hostIp: 'example.host.ip',
        name: 'example name',
      };

      await controller.updateDestination(body);

      expect(destinationsService.updateDestination).toHaveBeenCalledWith(body);
    });

    it('returns the expected valid response', async () => {
      const expectedResult = {
        aeTitle: 'testing ae title',
        port: 3456,
        hostIp: 'example.host.ip',
        name: 'example name',
      };

      destinationsService.updateDestination.mockResolvedValue(expectedResult);

      const response = await controller.updateDestination({
        aeTitle: 'testing ae title',
        port: 3456,
        hostIp: 'example.host.ip',
        name: 'example name',
      });

      expect(response).toStrictEqual(expectedResult);
    });
  });
});
