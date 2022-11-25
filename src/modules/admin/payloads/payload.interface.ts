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

import { IPagedMonaiResponse } from 'shared/helper/paging/paging.interface';

export interface IGetPayloadsQueryParams {
  pageNumber: number;
  pageSize: number;
}

export interface IMonaiPayloadResponse
  extends IPagedMonaiResponse<IMonaiPayload> {
  succeeded: boolean;
  errors: string[];
  message: string;
}

export interface IMonaiPayload {
  id: string;
  payload_id: string;
  workflows: string[];
  workflow_instance_ids: string[];
  file_count: number;
  correlation_id: string;
  bucket: string;
  calling_aetitle: string;
  called_aetitle: string;
  timestamp: string;
  files: any[];
  patient_details: IMonaiPayloadPatient;
}

export interface IMonaiPayloadPatient {
  patient_id: string;
  patient_name: string;
  patient_sex: string;
  patient_dob: string;
  patient_age: string;
  patient_hospital_id: string;
}

export interface WorkflowInstanceDto {
  id: string;
  ae_title: string;
  workflow_name: string;
  workflow_id: string;
  start_time: string;
  payload_id: string;
  status: string;
  tasks: TaskExecutionDto[];
}

export interface TaskExecutionDto {
  execution_id: string;
  payload_id: string;
  workflow_instance_id: string;
  task_start_time: string;
  task_id: string;
  status: string;
  next_task: TaskExecutionDto[];
}
