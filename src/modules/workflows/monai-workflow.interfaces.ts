import { IPagedResponse } from 'shared/helper/paging/paging.interface';

export type PagedMonaiWorkflows = IPagedResponse<MonaiWorkflow>;

export interface MonaiWorkflow {
  id: string;
  workflow_id: string;
  revision: number;
  workflow: {
    name: string;
    version: string;
    description: string;
  };
}
