import { IMonaiPayload } from '../payloads/payload.interface';
import {
  MonaiWorkflowInstance,
  MonaiWorkflowTask,
} from '../workflowinstances/workflowinstances.interface';

export class IssueDto {
  task_id: string;
  status: string;
  workflow_name: string;
  patient_name: string;
  patient_id: string;
  execution_time: string;
  workflow_instance_id: string;
  execution_id: string;

  public static from(
    task: MonaiWorkflowTask,
    relativePayload: IMonaiPayload,
    relativeWorkflowInstance: MonaiWorkflowInstance,
  ) {
    const issue = new IssueDto();
    issue.task_id = task.task_id;
    issue.workflow_instance_id = task.workflow_instance_id;
    issue.execution_id = task.execution_id;
    issue.patient_id = relativePayload?.patient_details?.patient_id;
    issue.patient_name = relativePayload?.patient_details?.patient_name;
    issue.status = task.status;
    issue.execution_time = task.task_start_time;
    issue.workflow_name = relativeWorkflowInstance.workflow_name;
    return issue;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Issue) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(issue: Issue = null) {
  //   const it = new Issue();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
