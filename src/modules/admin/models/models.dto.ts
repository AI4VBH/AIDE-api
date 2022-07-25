export class ModelDTO {
  model_id: number;
  model_name: string;

  public static from(dto: Partial<ModelDTO>) {
    const it = new ModelDTO();
    it.model_id = dto.model_id;
    it.model_name = dto.model_name;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Model) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(model: Model = null) {
  //   const it = new Model();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
