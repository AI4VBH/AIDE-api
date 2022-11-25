/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
