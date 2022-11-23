export class OverviewDTO {
  deployed_models: number;
  model_executions: number;
  model_failures: number;

  public static from(dto: Partial<OverviewDTO>) {
    const it = new OverviewDTO();
    it.deployed_models = dto.deployed_models;
    it.model_executions = dto.model_executions;
    it.model_failures = dto.model_failures;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Overview) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(overview: Overview = null) {
  //   const it = new Overview();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
