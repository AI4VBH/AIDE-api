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
import { Test, TestingModule } from '@nestjs/testing';
import { ElasticClient } from 'shared/elastic/elastic-client';
import { LogsService } from './logs.service';

describe('LogsService', () => {
  let service: LogsService;
  let elasticClient: DeepMocked<ElasticClient>;

  beforeEach(async () => {
    elasticClient = createMock<ElasticClient>();
    service = createMock<LogsService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        { provide: ElasticClient, useValue: elasticClient },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get logs by task', () => {
    it('returns expected result', async () => {
      const response = { statusCode: 200, body: elasticResponseObj } as any;
      elasticClient.getLogs.mockResolvedValue(response);

      const result = await service.getLogByTask(
        '59b14f66-4a5f-41a1-8e9f-acd706413857',
      );

      expect(elasticClient.getLogs).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });

  const elasticResponseObj = {
    took: 31,
    timed_out: false,
    _shards: {
      total: 42,
      successful: 42,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: {
        value: 10000,
        relation: 'gte',
      },
      max_score: 45.33331,
      hits: [
        {
          _index: 'logstash-2022.11.22',
          _type: '_doc',
          _id: 'Hl2snoQBNksrDXBpRxQ8',
          _score: 45.33331,
          _source: {
            path: '%{path.Value}',
            argoNamespace: 'argo',
            MessageId: 'd6f39216-08cf-4cc1-b11a-fd60774783ab',
            Level: 'DEBUG',
            ServiceName: 'Monai.Deploy.WorkflowManager.TaskManager',
            EventName: 'CreatingArgoClient',
            messageType: 'TaskDispatchEvent',
            CorrelationId: 'a65f65e6-0c68-46c5-aa97-79084a662a21',
            EventId: 1006,
            RecievedTime: '2022-11-22T09:29:50.3068175Z',
            LoggerName:
              'Monai.Deploy.WorkflowManager.TaskManager.Argo.ArgoProvider',
            executionId: 'a6346d13-f8ab-43ec-843c-51f0d560c812',
            ServiceVersion: '0.0.0-development',
            '@timestamp': '2022-11-22T09:30:01.285Z',
            workflowInstanceId: 'ec1c0d79-1209-4067-9ef7-d384fb5d21f6',
            Message:
              'Creating Argo client with base URL: http://argo-argo-workflows-server.argo:2746.',
            type: 'nlog',
            ApplicationId: '16988a78-87b5-4168-a5c3-2cfc2bab8e54',
            taskId: 'mean-pixel-calc',
            MachineName: 'task-manager-6f78f55875-6p6fq',
            baseUrl: 'http://argo-argo-workflows-server.argo:2746',
            '@version': '1',
            headers: {
              connection: 'Keep-Alive',
              http_user_agent: null,
              content_length: '928',
              http_accept: null,
              request_path: '/',
              http_version: 'HTTP/1.1',
              http_host: 'logstash.shared:5011',
              request_method: 'POST',
            },
          },
        },
        {
          _index: 'logstash-2022.11.22',
          _type: '_doc',
          _id: 'Il2snoQBNksrDXBpSBQT',
          _score: 45.33331,
          _source: {
            path: '%{path.Value}',
            argoNamespace: 'argo',
            MessageId: 'd6f39216-08cf-4cc1-b11a-fd60774783ab',
            Level: 'DEBUG',
            ServiceName: 'Monai.Deploy.WorkflowManager.TaskManager',
            EventName: 'GeneratingArtifactSecret',
            messageType: 'TaskDispatchEvent',
            CorrelationId: 'a65f65e6-0c68-46c5-aa97-79084a662a21',
            EventId: 1000,
            RecievedTime: '2022-11-22T09:29:50.3068175Z',
            LoggerName:
              'Monai.Deploy.WorkflowManager.TaskManager.Argo.ArgoPlugin',
            executionId: 'a6346d13-f8ab-43ec-843c-51f0d560c812',
            ServiceVersion: '0.0.0-development',
            '@timestamp': '2022-11-22T09:30:01.492Z',
            name: 'input-dicom',
            Message:
              'Generating Kubernetes secrets for accessing artifacts: input-dicom.',
            type: 'nlog',
            ApplicationId: '16988a78-87b5-4168-a5c3-2cfc2bab8e54',
            workflowInstanceId: 'ec1c0d79-1209-4067-9ef7-d384fb5d21f6',
            taskId: 'mean-pixel-calc',
            MachineName: 'task-manager-6f78f55875-6p6fq',
            '@version': '1',
            headers: {
              connection: 'Keep-Alive',
              http_user_agent: null,
              content_length: '884',
              http_accept: null,
              request_path: '/',
              http_version: 'HTTP/1.1',
              http_host: 'logstash.shared:5011',
              request_method: 'POST',
            },
          },
        },
      ],
    },
  };
});
