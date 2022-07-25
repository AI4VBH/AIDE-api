export class IssueDTO {
  task_id: number;
  status: string;
  model_name: string;
  patient_name: string;
  patient_id: string;
  execution_time: string;

  public static from(dto: Partial<IssueDTO>) {
    const it = new IssueDTO();
    it.task_id = dto.task_id;
    it.status = dto.status;
    it.model_name = dto.model_name;
    it.patient_name = dto.patient_name;
    it.patient_id = dto.patient_id;
    it.execution_time = dto.execution_time;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Issue) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(issue: Issue = null) {
  //   const it = new Issue();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
