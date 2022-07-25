export class PayloadDTO {
  payload_id: number;
  patient_name: string;
  patient_id: string;
  payload_received: string;

  public static from(dto: Partial<PayloadDTO>) {
    const it = new PayloadDTO();
    it.payload_id = dto.payload_id;
    it.patient_name = dto.patient_name;
    it.patient_id = dto.patient_id;
    it.payload_received = dto.payload_received;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Payload) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(payload: Payload = null) {
  //   const it = new Payload();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
