import { Test, TestingModule } from '@nestjs/testing';
import { PayloadsController } from './payloads.controller';

describe('PayloadsController', () => {
  let controller: PayloadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayloadsController],
    }).compile();

    controller = module.get<PayloadsController>(PayloadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
