export class GraphDTO {
  model_id: number;
  status: string;
  model_name: string;
  total_executions: number;
  total_failures: number;
  days: ModelStatisticsDTO[];

  public static from(dto: Partial<GraphDTO>) {
    const it = new GraphDTO();
    it.model_id = dto.model_id;
    it.status = dto.status;
    it.model_name = dto.model_name;
    it.total_executions = dto.total_executions;
    it.total_failures = dto.total_failures;
    it.days = dto.days;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Graph) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(graph: Graph = null) {
  //   const it = new Graph();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}

export class ModelStatisticsDTO {
  date: string;
  total_executions: number;
  total_failures: number;

  public static from(dto: Partial<ModelStatisticsDTO>) {
    const it = new ModelStatisticsDTO();
    it.date = dto.date;
    it.total_executions = dto.total_executions;
    it.total_failures = dto.total_failures;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: ModelStatistics) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(modelStatistics: ModelStatistics = null) {
  //   const it = new ModelStatistics();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
