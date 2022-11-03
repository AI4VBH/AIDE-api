import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionsController } from './executions.controller';
import { ExecutionsService } from './executions.service';

describe('ExecutionsController', () => {
  let controller: ExecutionsController;
  let executionsService: DeepMocked<ExecutionsService>;

  beforeEach(async () => {
    executionsService = createMock<ExecutionsService>();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({})],
        }),
      ],
      controllers: [ExecutionsController],
      providers: [{ provide: ExecutionsService, useValue: executionsService }],
    }).compile();

    controller = module.get<ExecutionsController>(ExecutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWorkflowInstanceArtifacts', () => {
    it('returns expected result', async () => {
      executionsService.getWorkflowInstanceArtifacts.mockResolvedValue({
        'file.ext': 'minio-object-key/file.ext',
        'file-2.ext': 'minio-object-key/file-2.ext',
      });

      const result = await controller.getWorkflowInstanceArtifacts(
        'c7ec91ef-7228-441c-9f74-a5d09384ccb6',
        '5256047b-ac8b-41eb-b8cb-072678992081',
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('getWorkflowInstanceMetadata', () => {
    it('returns expected result', async () => {
      executionsService.getWorkflowInstanceMetadata.mockResolvedValue({
        'stat-1': 'value',
        'stat-2': 'value 2',
      });

      const result = await controller.getWorkflowInstanceMetadata(
        '889ea3b6-9123-4a1a-81c1-6c84e9152783',
        '0c195a19-2631-4f28-9654-0b1ed6e6925d',
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('getArtifactDownloadUrl', () => {
    it('returns expected result', async () => {
      executionsService.getArtifactUrl.mockResolvedValue(
        'http://some.minio.com/file.ext',
      );

      const result = await controller.getArtifactDownloadUrl('file.ext');

      expect(result).toMatchSnapshot();
    });

    it.each(['', ' ', null, undefined])(
      'throws exception when key is %s',
      async (key: string) => {
        const action = async () => await controller.getArtifactDownloadUrl(key);

        await expect(action).rejects.toThrow(BadRequestException);
      },
    );
  });
});
