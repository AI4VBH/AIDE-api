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
import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowInstanceController } from './workflowinstances.controller';
import { MonaiWorkflowInstance } from './workflowinstances.interface';
import { WorkflowInstancesService } from './workflowinstances.service';

describe('WorkflowInstanceController', () => {
  let service: DeepMocked<WorkflowInstancesService>;
  let controller: WorkflowInstanceController;

  beforeEach(async () => {
    service = createMock<WorkflowInstancesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowInstanceController],
      providers: [
        {
          provide: WorkflowInstancesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<WorkflowInstanceController>(
      WorkflowInstanceController,
    );
  });

  it('should be defined', () => expect(controller).toBeDefined());

  describe('acknowledgeTaskErrors', () => {
    it('returns the expected valid response', async () => {
      const expectedResult: MonaiWorkflowInstance = {
        id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
        ae_title: 'some-title',
        payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
        workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
        start_time: '2022-09-22T12:45:13.102Z',
        acknowledged_workflow_errors: '2022-09-22T12:45:13.102Z',
        status: 'Succeeded',
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
      };

      service.acknowledgeTaskError.mockResolvedValue(expectedResult);

      const response = await controller.acknowledgeTaskError(
        'c5e980ff-e278-441b-af64-8630bf57b7e3',
        '981eca65-294a-434a-930a-b1828b54253a',
      );

      expect(response).toStrictEqual(expectedResult);
    });
  });
});
