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
