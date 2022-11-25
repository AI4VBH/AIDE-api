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
  payload_id: string;

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
    issue.payload_id = relativePayload?.payload_id;
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
