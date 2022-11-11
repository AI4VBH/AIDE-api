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

export interface ClinicalReviewTaskDetails {
  execution_id: string;
  study: ClinicalReviewTaskSeries[];
}

export interface ClinicalReviewTaskSeries {
  series_id: string;
  modality: string;
  files: string[];
}
