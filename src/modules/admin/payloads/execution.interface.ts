export interface Execution {
  execution_id: number;
  payload_id: number;
  model_name: string;
  execution_status: string;
  execution_started: string;
  execution_finished: string;
  executions: Execution[];
}
