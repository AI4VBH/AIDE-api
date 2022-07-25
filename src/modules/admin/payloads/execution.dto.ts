export class ExecutionDTO {
  execution_id: number;
  payload_id: number;
  model_name: string;
  execution_status: string;
  execution_started: string;
  execution_finished: string;
  executions: ExecutionDTO[];

  public static from(dto: Partial<ExecutionDTO>) {
    const it = new ExecutionDTO();
    it.execution_id = dto.execution_id;
    it.payload_id = dto.payload_id;
    it.model_name = dto.model_name;
    it.execution_status = dto.execution_status;
    it.execution_started = dto.execution_started;
    it.execution_finished = dto.execution_finished;
    it.executions = dto.executions;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Execution) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(execution: Execution = null) {
  //   const it = new Execution();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
