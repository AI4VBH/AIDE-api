import { IPagedResponse } from 'shared/helper/paging/paging.interface';

export type PagedMonaiWorkflows = IPagedResponse<MonaiWorkflow>;

export interface MonaiWorkflow {
  id: string;
  workflow_id: string;
  revision: number;
  workflow: WorkflowRevision;
}

export interface WorkflowRevision {
  name: string;
  version: string;
  description: string;
  informatics_gateway: InformaticsGateway;
}

export interface InformaticsGateway {
  ae_title: string;
  data_origins: string[];
  export_destinations: string[];
}

export interface Destination {
  port: number;
  name: string;
  aeTitle: string;
  hostIp: string;
}
