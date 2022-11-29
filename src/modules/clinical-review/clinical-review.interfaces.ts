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

import { IMonaiPayloadPatient } from 'modules/admin/payloads/payload.interface';
import { IPagedResponse } from 'shared/helper/paging/paging.interface';

export type PagedClinicalReviews = IPagedResponse<ClinicalReview>;

export interface PagedClinicalReviewDto {
  totalPages: number;
  totalRecords: number;
  data: ClinicalReview[];
}

export interface ClinicalReview {
  task_id: string;
  reviewed_task_id: string;
  execution_id: string;
  reviewed_execution_id: string;
  correlation_id: string;
  workflow_name: string;
  patient_metadata: IMonaiPayloadPatient;
  files: [{ [name: string]: string }];
}

export interface ClinicalReviewAcknowledge {
  acceptance: boolean;
  task_id: string;
  reason: string;
  message: string;
  execution_id: string;
  roles: string[];
  userId: string;
}
