import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsDto } from './logs.dto';
import { LogsService } from './logs.service';

describe('LogsController', () => {
  let controller: LogsController;
  let logsService: DeepMocked<LogsService>;

  beforeEach(async () => {
    logsService = createMock<LogsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        {
          provide: LogsService,
          useValue: logsService,
        },
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get logs', () => {
    it('calls service', async () => {
      const task = 'lillie-task-1';
      const expectedDto: LogsDto[] = [
        {
          level: 'Information',
          renderedMessage: 'this is a message',
          timestamp: new Date('2022-09-26T15:19:22.9668840Z'),
        },
        {
          level: 'Information',
          renderedMessage: 'this is a message',
          timestamp: new Date('2022-09-26T15:19:22.9668840Z'),
        },
        {
          level: 'Debug',
          renderedMessage:
            'Publishing message to "rabbitmq.monai"/"monaideploy". Exchange="monaideploy", Routing Key="md.tasks.dispatch".',
          timestamp: new Date('2022-09-26T15:18:22.9668840Z'),
        },
      ];

      logsService.getLogByTask.mockResolvedValue(expectedDto);

      const response = await controller.getLogs(task);

      expect(response).toMatchSnapshot();
      expect(logsService.getLogByTask).toHaveBeenCalledWith(task);
    });

    it.each([null, undefined])('id param cannot be empty', async (id) => {
      const action = async () => await controller.getLogs(id);

      await expect(action).rejects.toThrow(BadRequestException);
    });
  });
});
