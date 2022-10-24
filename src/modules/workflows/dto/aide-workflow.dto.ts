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
  ae_title: string;
  data_origins: string[];
}

interface InformaticsGateway {
  ae_title: string;
  export_destinations: string[];
}

export interface WorkflowDto extends Object {
  [key: string]: any;
  informatics_gateway: Partial<InformaticsGateway>;
}

export interface CreateEditWorkflowDto {
  workflow: Partial<WorkflowDto>;
}
