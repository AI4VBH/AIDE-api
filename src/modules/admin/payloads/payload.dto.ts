import { IMonaiPayload } from './payload.interface';

export class PayloadDTO {
  payload_id: string;
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

  public static fromMonaiPayload(entity: IMonaiPayload) {
    return PayloadDTO.from({
      payload_id: entity.payload_id,
      patient_name: entity.patient_details.patient_name,
      patient_id: entity.patient_details.patient_id,
      payload_received: entity.timestamp,
    });
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
