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
      const executionId = '59b14f66-4a5f-41a1-8e9f-acd706413857';
      const expectedDto: LogsDto[] = [
        {
          correlationId: '2ef8f893-0872-439a-8c2a-6da4f425f3f8',
          workflowInstanceId: '2cc76cd7-681a-44fa-a3f9-62509c1216b0',
          task: {
            Timeout: '2022-11-02T12:16:54.566Z',
            ExecutionId: '59b14f66-4a5f-41a1-8e9f-acd706413857',
            TaskId: 'mean-pixel-calc',
            ResultMetadata: {},
            TimeoutInterval: 60,
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
          message:
            'TaskFailed, Task {"execution_id":"59b14f66-4a5f-41a1-8e9f-acd706413857","workflow_instance_id":"2cc76cd7-681a-44fa-a3f9-62509c1216b0","task_type":"argo","task_start_time":"2022-11-02T11:16:54.566Z","task_end_time":null,"execution_stats":{},"task_plugin_arguments":{"namespace":"argo","workflow_template_name":"argo-workflow-1","server_url":"http://argo-argo-workflows-server.argo:2746","allow_insecure":"true"},"task_id":"mean-pixel-calc","previous_task_id":"","status":1,"reason":4,"input_artifacts":{"input-dicom":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/dcm"},"output_artifacts":{},"output_directory":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/workflows/2cc76cd7-681a-44fa-a3f9-62509c1216b0/59b14f66-4a5f-41a1-8e9f-acd706413857","result":{},"input_parameters":{},"next_timeout":"2022-11-02T12:16:54.566Z","timeout_interval":60.0,"acknowledged_task_errors":null}, workflowInstance {"id":"2cc76cd7-681a-44fa-a3f9-62509c1216b0","ae_title":"MONAI","workflow_name":"argo_export","workflow_id":"aeb8b4bd-e629-46fa-b1aa-71e51b00f815","payload_id":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8","start_time":"2022-11-02T11:16:54.526Z","status":0,"bucket_id":"monaideploy","input_metadata":{},"tasks":[{"execution_id":"59b14f66-4a5f-41a1-8e9f-acd706413857","workflow_instance_id":"2cc76cd7-681a-44fa-a3f9-62509c1216b0","task_type":"argo","task_start_time":"2022-11-02T11:16:54.566Z","task_end_time":null,"execution_stats":{},"task_plugin_arguments":{"namespace":"argo","workflow_template_name":"argo-workflow-1","server_url":"http://argo-argo-workflows-server.argo:2746","allow_insecure":"true"},"task_id":"mean-pixel-calc","previous_task_id":"","status":1,"reason":4,"input_artifacts":{"input-dicom":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/dcm"},"output_artifacts":{},"output_directory":"13b4217a-a747-42e8-b84f-8dbc1a8bd7c8/workflows/2cc76cd7-681a-44fa-a3f9-62509c1216b0/59b14f66-4a5f-41a1-8e9f-acd706413857","result":{},"input_parameters":{},"next_timeout":"2022-11-02T12:16:54.566Z","timeout_interval":60.0,"acknowledged_task_errors":null}],"acknowledged_workflow_errors":null}, patientDetails {"patient_id":"11788773431343","patient_name":"Fall 7","patient_sex":"O","patient_dob":"1900-01-01T00:00:00Z","patient_age":null,"patient_hospital_id":null}, correlationId 2ef8f893-0872-439a-8c2a-6da4f425f3f8, taskStatus Failed',
          taskStatus: 'Failed',
          level: 'INFO',
          timestamp: new Date('2022-11-02T17:10:32.336Z'),
        },
      ];

      logsService.getLogByTask.mockResolvedValue(expectedDto);

      const response = await controller.getLogs(executionId);

      expect(response).toMatchSnapshot();
      expect(logsService.getLogByTask).toHaveBeenCalledWith(executionId);
    });

    it.each([null, undefined])('id param cannot be empty', async (id) => {
      const action = async () => await controller.getLogs(id);

      await expect(action).rejects.toThrow(BadRequestException);
    });
  });
});
