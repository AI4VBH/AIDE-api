/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

import { Injectable } from '@nestjs/common';
import { OverviewDTO } from './overview.dto';

@Injectable()
export class OverviewService {
  getOverview(period): OverviewDTO {
    switch (period) {
      case 'day':
        return {
          deployed_models: 6,
          model_executions: 57,
          model_failures: 0,
        };
      case 'week':
        return {
          deployed_models: 6,
          model_executions: 254,
          model_failures: 10,
        };
      case 'month':
        return {
          deployed_models: 6,
          model_executions: 757,
          model_failures: 54,
        };
      default:
        return {
          deployed_models: 0,
          model_executions: 0,
          model_failures: 0,
        };
    }
  }
}
