export class LogsDto {
  message: string;
  correlationId: string;
  taskStatus: string;
  workflowInstanceId: string;
  task: unknown;
  timestamp: Date;
  level: string;
}
