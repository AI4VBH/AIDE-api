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
