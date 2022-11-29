/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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
    took: 186,
    timed_out: false,
    _shards: {
      total: 19,
      successful: 19,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: {
        value: 1,
        relation: 'eq',
      },
      max_score: 2.1381779,
      hits: [
        {
          _index: 'logstash-2022.11.02',
          _type: '_doc',
          _id: 'T9QPOIQBDU19xybcC605',
          _score: 2.1381779,
          _source: {
            LoggerName:
              'Monai.Deploy.WorkflowManager.WorkfowExecuter.Services.WorkflowExecuterService',
            '@timestamp': '2022-11-02T11:17:00.555Z',
            ServiceVersion: '0.0.0-development',
            messageDescription: 'TaskUpdateEvent',
            CorrelationId: '2ef8f893-0872-439a-8c2a-6da4f425f3f8',
            workflowInstanceId: '2cc76cd7-681a-44fa-a3f9-62509c1216b0',
            task: {
              Timeout: '2022-11-02T12:16:54.566Z',
              ExecutionId: '59b14f66-4a5f-41a1-8e9f-acd706413857',
              TaskId: 'mean-pixel-calc',
              ResultMetadata: {},
              TimeoutInterval: 60.0,
              Reason: 'PluginError',
              InputArtifacts: {},
              TaskStartTime: '2022-11-02T11:16:54.566Z',
              OutputArtifacts: {},
              Status: 'Dispatched',
              InputParameters: {},
              OutputDirectory:
                '13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/workflows/2cc76cd7-681a-44fa-a3f9-62509c1216b0/59b14f66-4a5f-41a1-8e9f-acd706413857',
              TaskPluginArguments: {},
              TaskType: 'argo',
              WorkflowInstanceId: '2cc76cd7-681a-44fa-a3f9-62509c1216b0',
              PreviousTaskId: '',
              ExecutionStats: {},
            },
            correlationId: '2ef8f893-0872-439a-8c2a-6da4f425f3f8',
            Message:
              'TaskFailed, Task {"execution_id":"59b14f66-4a5f-41a1-8e9f-acd706413857","workflow_instance_id":"2cc76cd7-681a-44fa-a3f9-62509c1216b0","task_type":"argo","task_start_time":"2022-11-02T11:16:54.566Z","task_end_time":null,"execution_stats":{},"task_plugin_arguments":{"namespace":"argo","workflow_template_name":"argo-workflow-1","server_url":"http://argo-argo-workflows-server.argo:2746","allow_insecure":"true"},"task_id":"mean-pixel-calc","previous_task_id":"","status":1,"reason":4,"input_artifacts":{"input-dicom":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/dcm"},"output_artifacts":{},"output_directory":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/workflows/2cc76cd7-681a-44fa-a3f9-62509c1216b0/59b14f66-4a5f-41a1-8e9f-acd706413857","result":{},"input_parameters":{},"next_timeout":"2022-11-02T12:16:54.566Z","timeout_interval":60.0,"acknowledged_task_errors":null}, workflowInstance {"id":"2cc76cd7-681a-44fa-a3f9-62509c1216b0","ae_title":"MONAI","workflow_name":"argo_export","workflow_id":"aeb8b4bd-e629-46fa-b1aa-71e51b00f815","payload_id":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8","start_time":"2022-11-02T11:16:54.526Z","status":0,"bucket_id":"monaideploy","input_metadata":{},"tasks":[{"execution_id":"59b14f66-4a5f-41a1-8e9f-acd706413857","workflow_instance_id":"2cc76cd7-681a-44fa-a3f9-62509c1216b0","task_type":"argo","task_start_time":"2022-11-02T11:16:54.566Z","task_end_time":null,"execution_stats":{},"task_plugin_arguments":{"namespace":"argo","workflow_template_name":"argo-workflow-1","server_url":"http://argo-argo-workflows-server.argo:2746","allow_insecure":"true"},"task_id":"mean-pixel-calc","previous_task_id":"","status":1,"reason":4,"input_artifacts":{"input-dicom":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/dcm"},"output_artifacts":{},"output_directory":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/workflows/2cc76cd7-681a-44fa-a3f9-62509c1216b0/59b14f66-4a5f-41a1-8e9f-acd706413857","result":{},"input_parameters":{},"next_timeout":"2022-11-02T12:16:54.566Z","timeout_interval":60.0,"acknowledged_task_errors":null}],"acknowledged_workflow_errors":null}, patientDetails {"patient_id":"11788773431343","patient_name":"Fall 7","patient_sex":"O","patient_dob":"1900-01-01T00:00:00Z","patient_age":null,"patient_hospital_id":null}, correlationId 2ef8f893-0872-439a-8c2a-6da4f425f3f8, taskStatus Failed',
            patientDetails: {
              PatientSex: 'O',
              PatientDob: '1900-01-01T00:00:00Z',
              PatientName: 'Fall 7',
              PatientId: '11788773431343',
            },
            taskId: 'mean-pixel-calc',
            MachineName: 'workflow-manager-79f48cdbdd-qhvqp',
            type: 'nlog',
            EventId: 200015,
            taskStatus: 'Failed',
            source: '4c9072a1-35f5-4d85-847d-dafca22244a8',
            path: '%{path.Value}',
            ServiceName: 'Monai.Deploy.WorkflowManager',
            ApplicationId: '4c9072a1-35f5-4d85-847d-dafca22244a8',
            Level: 'INFO',
            headers: {
              content_length: '4448',
              connection: 'Keep-Alive',
              request_path: '/',
              http_version: 'HTTP/1.1',
              http_accept: null,
              http_host: 'logstash.shared:5011',
              http_user_agent: null,
              request_method: 'POST',
            },
            MessageId: '1a0af912-5b9b-4d07-a572-442ef33361f7',
            workflowInstance: {
              InputMetaData: {},
              WorkflowId: 'aeb8b4bd-e629-46fa-b1aa-71e51b00f815',
              BucketId: 'monaideploy',
              Status: 'Created',
              PayloadId: '13b4217a-a747-42e8-b84f-8dbc1a8bd7c8',
              Tasks: [],
              WorkflowName: 'argo_export',
              Id: '2cc76cd7-681a-44fa-a3f9-62509c1216b0',
              StartTime: '2022-11-02T11:16:54.526Z',
              AeTitle: 'MONAI',
            },
            '@version': '1',
            EventName: 'TaskFailed',
            durationSoFar: 5974.5682,
          },
        },
      ],
    },
  };
});
