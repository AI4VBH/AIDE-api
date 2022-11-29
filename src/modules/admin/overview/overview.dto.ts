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
