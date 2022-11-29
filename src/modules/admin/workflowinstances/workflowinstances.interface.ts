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

export interface MonaiWorkflowInstance {
  id: string;
  ae_title: string;
  workflow_id: string;
  workflow_name: string;
  start_time: string;
  payload_id: string;
  status: string;
  bucket_id: string;
  acknowledged_workflow_errors: string;
  tasks: MonaiWorkflowTask[];
  input_metadata: [{ [name: string]: string }];
}

export interface MonaiWorkflowTask {
  execution_id: string;
  workflow_instance_id: string;
  previous_task_id: string;
  task_id: string;
  task_type: string;
  task_start_time: string;
  status: string;
  reason: string;
  acknowledged_task_errors: string;
  input_artifacts: [{ [name: string]: string }];
  output_artifacts: [{ [name: string]: string }];
  output_directory: string;
  result: [{ [name: string]: string }];
  next_timeout: string;
  timeout_interval: number;
  execution_stats?: [{ [name: string]: string }];
}
