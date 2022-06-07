import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionStatsService } from './execution-stats.service';

describe('ExecutionStatsService', () => {
  let service: ExecutionStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutionStatsService],
    }).compile();

    service = module.get<ExecutionStatsService>(ExecutionStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
