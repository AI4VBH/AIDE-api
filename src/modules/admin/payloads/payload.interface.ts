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

/**
 * This does not represent all of the properties of a Workflow Instance
 */
export interface MonaiWorkflowInstance {
  id: string;
  ae_title: string;
  workflow_id: string;
  start_time: string;
  payload_id: string;
  status: string;
  tasks: MonaiWorkflowTask[];
}

/**
 * This does not represent all of the properties of a Task
 */
export interface MonaiWorkflowTask {
  execution_id: string;
  workflow_instance_id: string;
  payload_id: string;
  previous_task_id: string;
  task_id: string;
  task_start_time: string;
  status: string;
}

export interface WorkflowInstanceDto {
  id: string;
  ae_title: string;
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
