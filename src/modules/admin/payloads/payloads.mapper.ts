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

import {
  MonaiWorkflowInstance,
  MonaiWorkflowTask,
} from '../workflowinstances/workflowinstances.interface';
import { TaskExecutionDto, WorkflowInstanceDto } from './payload.interface';

export function mapWorkflowInstancesToExecutions(
  instances: MonaiWorkflowInstance[],
) {
  if (!instances) {
    throw new Error('instances is required');
  }

  if (!Array.isArray(instances)) {
    throw new Error('instances is not an array');
  }

  return instances.map((instance) => {
    const topLevel = instance.tasks.filter(
      (t) => t.previous_task_id === '' || !t.previous_task_id,
    );

    const nested = instance.tasks.filter((t) => !!t.previous_task_id);

    const instanceDto: WorkflowInstanceDto = {
      id: instance.id,
      ae_title: instance.ae_title,
      workflow_id: instance.workflow_id,
      workflow_name: instance.workflow_name,
      payload_id: instance.payload_id,
      start_time: instance.start_time,
      status: instance.status,
      tasks: topLevel.map((t) =>
        mapTaskToTaskExecution(instance.payload_id, t, nested),
      ),
    };

    return instanceDto;
  });
}

export function mapTaskToTaskExecution(
  payload_id: string,
  task: MonaiWorkflowTask,
  tasks: MonaiWorkflowTask[],
): TaskExecutionDto {
  if (!task || !tasks) {
    throw new Error('task and tasks are required');
  }

  const children = tasks.filter((t) => t.previous_task_id === task.task_id);

  return {
    payload_id,
    execution_id: task.execution_id,
    workflow_instance_id: task.workflow_instance_id,
    task_start_time: task.task_start_time,
    task_id: task.task_id,
    status: task.status,
    next_task: children.map((t) =>
      mapTaskToTaskExecution(payload_id, t, tasks),
    ),
  };
}
