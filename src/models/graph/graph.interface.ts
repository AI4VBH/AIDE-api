export interface Graph {
  model_id: number;
  status: string;
  model_name: string;
  total_executions: number;
  total_failures: number;
  days: ModelStatistics[];
}

export interface ModelStatistics {
  date: string;
  total_executions: number;
  total_failures: number;
}
