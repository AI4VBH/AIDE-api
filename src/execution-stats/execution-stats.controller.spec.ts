import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionStatsController } from './execution-stats.controller';

describe('ExecutionStatsController', () => {
  let controller: ExecutionStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutionStatsController],
    }).compile();

    controller = module.get<ExecutionStatsController>(ExecutionStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
