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
