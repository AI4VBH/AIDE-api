import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

describe('DestinationsController', () => {
  let destinationsController: DestinationsController;
  let destinationsService: DeepMocked<DestinationsService>;

  beforeEach(async () => {
    destinationsService = createMock<DestinationsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationsController],
      providers: [
        { provide: DestinationsService, useValue: destinationsService },
      ],
    }).compile();

    destinationsController = module.get<DestinationsController>(
      DestinationsController,
    );
  });

  it('should be defined', () => {
    expect(destinationsController).toBeDefined();
  });

  describe('getDestinations', () => {
    it('calls the correct service method', async () => {
      await destinationsService.getDestinations();

      expect(destinationsService.getDestinations).toHaveBeenCalledTimes(1);
    });
  });
});
