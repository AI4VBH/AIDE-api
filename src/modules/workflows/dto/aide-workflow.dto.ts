export interface PagedWorkflowsDto {
  totalPages: number;
  totalRecords: number;
  data: PagedWorkflowsItemDto[];
}

export interface PagedWorkflowsItemDto {
  id: string;
  workflow_id: string;
  revision: number;
  name: string;
  version: string;
  description: string;
}

export interface CreateEditWorkflowDto {
  workflow: object;
}
