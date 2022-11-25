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

import {
  MonaiWorkflowInstance,
  MonaiWorkflowTask,
} from '../workflowinstances/workflowinstances.interface';
import {
  mapTaskToTaskExecution,
  mapWorkflowInstancesToExecutions,
} from './payloads.mapper';

describe('workflowInstancesToExecutionsMapper', () => {
  it.each([null, undefined])(
    'throws error when instances is %s',
    (instances) => {
      const action = () => mapWorkflowInstancesToExecutions(instances);

      expect(action).toThrowError();
    },
  );

  it('returns expected result', () => {
    const instances: MonaiWorkflowInstance[] = [
      {
        id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
        ae_title: 'some-title',
        payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
        workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
        workflow_name: 'some-workflow-name',
        start_time: '2022-09-22T12:45:13.102Z',
        status: 'Succeeded',
        tasks: [
          {
            task_id: 'some-special-task',
            workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
            execution_id: '981eca65-294a-434a-930a-b1828b54253a',
            previous_task_id: '',
            status: 'Suceeded',
            task_start_time: '2022-09-23T12:50:00.305Z',
          } as MonaiWorkflowTask,
          {
            task_id: 'export-task',
            workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
            execution_id: '981eca65-294a-434a-930a-b1828b54253a',
            previous_task_id: 'some-special-task',
            status: 'Suceeded',
            task_start_time: '2022-09-23T12:50:00.305Z',
          } as MonaiWorkflowTask,
          {
            task_id: 'email-task',
            workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
            execution_id: '981eca65-294a-434a-930a-b1828b54253a',
            previous_task_id: 'export-task',
            status: 'Suceeded',
            task_start_time: '2022-09-23T12:50:00.305Z',
          } as MonaiWorkflowTask,
        ],
      } as MonaiWorkflowInstance,
    ];

    const result = mapWorkflowInstancesToExecutions(instances);

    expect(result).toMatchSnapshot();
  });
});

describe('taskToTaskExecution', () => {
  it.each([null, undefined])('throws error when task is %s', (task) => {
    const action = () => mapTaskToTaskExecution('some-id', task, []);

    expect(action).toThrowError();
  });

  it('maps the tasks correctly', () => {
    const toplevelTasks: MonaiWorkflowTask[] = [
      {
        task_id: 'some-special-task',
        workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
        execution_id: '981eca65-294a-434a-930a-b1828b54253a',
        previous_task_id: '',
        status: 'Suceeded',
        task_start_time: '2022-09-23T12:50:00.305Z',
      } as MonaiWorkflowTask,
    ];

    const tasks: MonaiWorkflowTask[] = [
      {
        task_id: 'export-task',
        workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
        execution_id: '981eca65-294a-434a-930a-b1828b54253a',
        previous_task_id: 'some-special-task',
        status: 'Suceeded',
        task_start_time: '2022-09-23T12:50:00.305Z',
      } as MonaiWorkflowTask,
      {
        task_id: 'email-task',
        workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
        execution_id: '981eca65-294a-434a-930a-b1828b54253a',
        previous_task_id: 'export-task',
        status: 'Suceeded',
        task_start_time: '2022-09-23T12:50:00.305Z',
      } as MonaiWorkflowTask,
    ];

    const result = toplevelTasks.map((t) =>
      mapTaskToTaskExecution('some-payload-id', t, tasks),
    );

    expect(result).toMatchSnapshot();
  });
});
