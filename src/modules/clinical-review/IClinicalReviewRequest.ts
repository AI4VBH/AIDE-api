export interface IClinicalReviewRequest {
  pageNumber: number;
  pageSize: number;
  patientId: string;
  patientName: string;
  applicationName: string;
  roles: string[];
}
