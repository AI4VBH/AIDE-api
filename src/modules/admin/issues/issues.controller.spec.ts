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
import { IMonaiPayload } from '../payloads/payload.interface';
import { MonaiWorkflowInstance } from '../workflowinstances/workflowinstances.interface';
import { WorkflowInstancesService } from '../workflowinstances/workflowinstances.service';
import { IssuesController } from './issues.controller';
import { IssueDto } from './issues.dto';
import { IssuesService } from './issues.service';

describe('IssuesController', () => {
  let wfiService: DeepMocked<WorkflowInstancesService>;
  let service: DeepMocked<IssuesService>;
  let controller: IssuesController;

  beforeEach(async () => {
    wfiService = createMock<WorkflowInstancesService>();
    service = createMock<IssuesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuesController],
      providers: [
        {
          provide: WorkflowInstancesService,
          useValue: wfiService,
        },
        {
          provide: IssuesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<IssuesController>(IssuesController);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  describe('acknowledgeTaskErrors', () => {
    it('gets failed workflowInstances', async () => {
      const givenWorkflowInstances: MonaiWorkflowInstance[] = [
        {
          id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
          ae_title: 'some-title',
          payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
          workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
          start_time: '2022-09-22T12:45:13.102Z',
          acknowledged_workflow_errors: '2022-09-22T12:45:13.102Z',
          status: 'Failed',
          tasks: [
            {
              task_id: 'email-task',
              workflow_instance_id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
              execution_id: '981eca65-294a-434a-930a-b1828b54253a',
              previous_task_id: 'export-task',
              task_start_time: '2022-09-23T12:50:00.305Z',
              task_type: 'test',
              status: 'Failed',
              acknowledged_task_errors: '2022-09-23T12:50:00.305Z',
              reason: 'undefined',
              input_artifacts: [{ name: '', value: '' }],
              output_artifacts: [{ name: '', value: '' }],
              output_directory: 'outputdir',
              result: [{ name: '', value: '' }],
              next_timeout: '2',
              timeout_interval: 60,
            },
          ],
          bucket_id: 'bucket',
          input_metadata: [{ name: '', value: '' }],
          workflow_name: 'lillie',
        },
      ];
      const givenPayload: IMonaiPayload = {
        id: 'Id',
        payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
        workflows: [],
        workflow_instance_ids: ['c5e980ff-e278-441b-af64-8630bf57b7e3'],
        file_count: 0,
        correlation_id: 'd37b8de8-e265-504d-8ab3-bdbff199d206xx',
        bucket: 'bucket',
        calling_aetitle: 'B99E00',
        called_aetitle: '484406',
        timestamp: '2022-04-14T16:25:37+01:00',
        files: [],
        patient_details: {
          patient_id: '29FA59',
          patient_name: 'Rebecca',
          patient_sex: 'Franklin',
          patient_dob: '20/08/2022',
          patient_age: '25',
          patient_hospital_id: 'Buvveho',
        },
      };

      const expectedIssuesDto = new IssueDto();
      expectedIssuesDto.execution_id = '981eca65-294a-434a-930a-b1828b54253a';
      expectedIssuesDto.execution_time = '2022-09-23T12:50:00.305Z';
      expectedIssuesDto.patient_id = givenPayload.patient_details.patient_id;
      expectedIssuesDto.patient_name =
        givenPayload.patient_details.patient_name;
      expectedIssuesDto.status = 'Failed';
      expectedIssuesDto.task_id = 'email-task';
      expectedIssuesDto.workflow_instance_id =
        'c5e980ff-e278-441b-af64-8630bf57b7e3';
      expectedIssuesDto.workflow_name = 'lillie';

      service.getIssues.mockResolvedValue([expectedIssuesDto]);
      wfiService.getAcknowledgedTaskErrors.mockResolvedValue(
        givenWorkflowInstances,
      );

      const response = await controller.getAcknowledgedTaskErrors();
      expect(response).toStrictEqual([expectedIssuesDto]);
    });
  });
});
