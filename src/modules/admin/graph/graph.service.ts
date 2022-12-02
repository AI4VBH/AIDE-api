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
import { GraphDTO } from './graph.dto';

@Injectable()
export class GraphService {
  getGraph(model_id, start_date, end_date): GraphDTO {
    switch (model_id) {
      case 1:
        return {
          model_id: 1,
          model_name: '3D Fetal Body MRI',
          total_executions: 483,
          total_failures: 14,
          status: 'Active',
          days: [
            {
              date: '20220516',
              total_executions: 50,
              total_failures: 1,
            },
            {
              date: '20220517',
              total_executions: 60,
              total_failures: 2,
            },
            {
              date: '20220520',
              total_executions: 45,
              total_failures: 1,
            },
            {
              date: '20220521',
              total_executions: 40,
              total_failures: 3,
            },
            {
              date: '20220522',
              total_executions: 30,
              total_failures: 2,
            },
            {
              date: '20220523',
              total_executions: 55,
              total_failures: 1,
            },
            {
              date: '20220524',
              total_executions: 53,
              total_failures: 2,
            },
            {
              date: '20220525',
              total_executions: 45,
              total_failures: 1,
            },
            {
              date: '20220526',
              total_executions: 48,
              total_failures: 1,
            },
            {
              date: '20220527',
              total_executions: 57,
              total_failures: 0,
            },
          ],
        };
      case 2:
        return {
          model_id: 2,
          model_name: '3D Fetal Brain MRI',
          total_executions: 423,
          total_failures: 44,
          status: 'Active',
          days: [
            {
              date: '20220516',
              total_executions: 31,
              total_failures: 5,
            },
            {
              date: '20220517',
              total_executions: 50,
              total_failures: 4,
            },
            {
              date: '20220520',
              total_executions: 35,
              total_failures: 5,
            },
            {
              date: '20220521',
              total_executions: 45,
              total_failures: 4,
            },
            {
              date: '20220522',
              total_executions: 40,
              total_failures: 7,
            },
            {
              date: '20220523',
              total_executions: 44,
              total_failures: 4,
            },
            {
              date: '20220524',
              total_executions: 33,
              total_failures: 5,
            },
            {
              date: '20220525',
              total_executions: 40,
              total_failures: 4,
            },
            {
              date: '20220526',
              total_executions: 50,
              total_failures: 5,
            },
            {
              date: '20220527',
              total_executions: 60,
              total_failures: 1,
            },
          ],
        };
      case 3:
        return {
          model_id: 3,
          model_name: '3D Fetal Heart MRI',
          total_executions: 1483,
          total_failures: 114,
          status: 'Active',
          days: [
            {
              date: '20220516',
              total_executions: 150,
              total_failures: 11,
            },
            {
              date: '20220517',
              total_executions: 160,
              total_failures: 12,
            },
            {
              date: '20220520',
              total_executions: 145,
              total_failures: 11,
            },
            {
              date: '20220521',
              total_executions: 140,
              total_failures: 13,
            },
            {
              date: '20220522',
              total_executions: 130,
              total_failures: 12,
            },
            {
              date: '20220523',
              total_executions: 155,
              total_failures: 11,
            },
            {
              date: '20220524',
              total_executions: 153,
              total_failures: 12,
            },
            {
              date: '20220525',
              total_executions: 145,
              total_failures: 11,
            },
            {
              date: '20220526',
              total_executions: 148,
              total_failures: 11,
            },
            {
              date: '20220527',
              total_executions: 157,
              total_failures: 10,
            },
          ],
        };
      case 4:
        return {
          model_id: 4,
          model_name: 'Stroke Pathway',
          total_executions: 92,
          total_failures: 14,
          status: 'Active',
          days: [
            {
              date: '20220516',
              total_executions: 10,
              total_failures: 1,
            },
            {
              date: '20220517',
              total_executions: 14,
              total_failures: 2,
            },
            {
              date: '20220520',
              total_executions: 11,
              total_failures: 1,
            },
            {
              date: '20220521',
              total_executions: 20,
              total_failures: 3,
            },
            {
              date: '20220522',
              total_executions: 10,
              total_failures: 2,
            },
            {
              date: '20220523',
              total_executions: 8,
              total_failures: 1,
            },
            {
              date: '20220524',
              total_executions: 6,
              total_failures: 2,
            },
            {
              date: '20220525',
              total_executions: 4,
              total_failures: 1,
            },
            {
              date: '20220526',
              total_executions: 5,
              total_failures: 1,
            },
            {
              date: '20220527',
              total_executions: 4,
              total_failures: 0,
            },
          ],
        };
      case 5:
        return {
          model_id: 5,
          model_name: 'Brainminer CT',
          total_executions: 226,
          total_failures: 14,
          status: 'Active',
          days: [
            {
              date: '20220516',
              total_executions: 20,
              total_failures: 1,
            },
            {
              date: '20220517',
              total_executions: 30,
              total_failures: 2,
            },
            {
              date: '20220520',
              total_executions: 22,
              total_failures: 1,
            },
            {
              date: '20220521',
              total_executions: 34,
              total_failures: 3,
            },
            {
              date: '20220522',
              total_executions: 21,
              total_failures: 2,
            },
            {
              date: '20220523',
              total_executions: 20,
              total_failures: 1,
            },
            {
              date: '20220524',
              total_executions: 22,
              total_failures: 2,
            },
            {
              date: '20220525',
              total_executions: 22,
              total_failures: 1,
            },
            {
              date: '20220526',
              total_executions: 23,
              total_failures: 1,
            },
            {
              date: '20220527',
              total_executions: 12,
              total_failures: 0,
            },
          ],
        };
      case 6:
        return {
          model_id: 6,
          model_name: 'MR Spectroscopy',
          total_executions: 403,
          total_failures: 14,
          status: 'Active',
          days: [
            {
              date: '20220516',
              total_executions: 10,
              total_failures: 1,
            },
            {
              date: '20220517',
              total_executions: 50,
              total_failures: 2,
            },
            {
              date: '20220520',
              total_executions: 60,
              total_failures: 1,
            },
            {
              date: '20220521',
              total_executions: 22,
              total_failures: 3,
            },
            {
              date: '20220522',
              total_executions: 45,
              total_failures: 2,
            },
            {
              date: '20220523',
              total_executions: 41,
              total_failures: 1,
            },
            {
              date: '20220524',
              total_executions: 33,
              total_failures: 2,
            },
            {
              date: '20220525',
              total_executions: 44,
              total_failures: 1,
            },
            {
              date: '20220526',
              total_executions: 45,
              total_failures: 1,
            },
            {
              date: '20220527',
              total_executions: 53,
              total_failures: 0,
            },
          ],
        };
      default:
        return {} as GraphDTO;
    }
  }
}
