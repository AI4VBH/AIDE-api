import { Test, TestingModule } from '@nestjs/testing';
import { GraphController } from './graph.controller';

describe('GraphController', () => {
  let controller: GraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphController],
    }).compile();

    controller = module.get<GraphController>(GraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
