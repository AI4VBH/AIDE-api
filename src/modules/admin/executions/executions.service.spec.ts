/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { MinioClient } from 'shared/minio/minio-client';
import { makeObservableForTest } from 'test/utilities/test-make-observable';
import { ExecutionsService } from './executions.service';
import { ExecutionsServiceException } from './executions.service.exceptions';

describe('ExecutionsService', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let service: ExecutionsService;
  let minioClient: DeepMocked<MinioClient>;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    minioClient = createMock<MinioClient>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutionsService,
        { provide: MinioClient, useValue: minioClient },
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get<ExecutionsService>(ExecutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWorkflowInstanceArtifacts', () => {
    it('returns expected result with artifacts', async () => {
      const workflowInstance = {
        tasks: [
          {
            execution_id: '6db02ec8-e77f-442d-b2b8-397f4935e907',
            status: 'Suceeded',
            output_artifacts: {
              'file.ext': 'minio-object-key/file.ext',
            },
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: workflowInstance,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getWorkflowInstanceArtifacts(
        '77b1e52c-6771-4385-b93d-d47970866309',
        '6db02ec8-e77f-442d-b2b8-397f4935e907',
      );

      expect(httpService.get).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });

    it('returns expected result with no artifacts', async () => {
      const workflowInstance = {
        tasks: [
          {
            execution_id: '6db02ec8-e77f-442d-b2b8-397f4935e907',
            status: 'Suceeded',
            output_artifacts: {},
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: workflowInstance,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getWorkflowInstanceArtifacts(
        '77b1e52c-6771-4385-b93d-d47970866309',
        '6db02ec8-e77f-442d-b2b8-397f4935e907',
      );

      expect(httpService.get).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });

    it('throws exception when no task is found', async () => {
      const workflowInstance = {
        tasks: [
          {
            execution_id: '6db02ec8-e77f-442d-b2b8-397f4935e907',
            status: 'Suceeded',
            output_artifacts: {},
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: workflowInstance,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const action = async () =>
        await service.getWorkflowInstanceArtifacts(
          '77b1e52c-6771-4385-b93d-d47970866309',
          'f76933bf-d157-49ae-96d6-e335a029b167',
        );

      await expect(action).rejects.toThrowError(ExecutionsServiceException);
    });
  });

  describe('getWorkflowInstanceMetadata', () => {
    it('returns expected result with artifacts', async () => {
      const workflowInstance = {
        tasks: [
          {
            execution_id: '6db02ec8-e77f-442d-b2b8-397f4935e907',
            status: 'Suceeded',
            output_artifacts: {
              'file.ext': 'minio-object-key/file.ext',
            },
            execution_stats: {
              'stat-1': 'value',
            },
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: workflowInstance,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getWorkflowInstanceMetadata(
        '77b1e52c-6771-4385-b93d-d47970866309',
        '6db02ec8-e77f-442d-b2b8-397f4935e907',
      );

      expect(httpService.get).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });

    it('returns expected result with no artifacts', async () => {
      const workflowInstance = {
        tasks: [
          {
            execution_id: '6db02ec8-e77f-442d-b2b8-397f4935e907',
            status: 'Suceeded',
            output_artifacts: {},
            execution_stats: {},
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: workflowInstance,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getWorkflowInstanceMetadata(
        '77b1e52c-6771-4385-b93d-d47970866309',
        '6db02ec8-e77f-442d-b2b8-397f4935e907',
      );

      expect(httpService.get).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });

    it('throws exception when no task is found', async () => {
      const workflowInstance = {
        tasks: [
          {
            execution_id: '6db02ec8-e77f-442d-b2b8-397f4935e907',
            status: 'Suceeded',
            output_artifacts: {},
            execution_stats: {},
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: workflowInstance,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const action = async () =>
        await service.getWorkflowInstanceMetadata(
          '77b1e52c-6771-4385-b93d-d47970866309',
          'f76933bf-d157-49ae-96d6-e335a029b167',
        );

      await expect(action).rejects.toThrowError(ExecutionsServiceException);
    });
  });
});
