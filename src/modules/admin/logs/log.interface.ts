export interface Logs {
  json: Log;
}

export interface Log {
  execution_id: string;
  level: string;
  line_no: number;
  logger: string;
  model_name: string;
  model_version: string;
  module: string;
  msg: string;
  thread: string;
  type: string;
  written_at: string;
  written_ts: number;
}
