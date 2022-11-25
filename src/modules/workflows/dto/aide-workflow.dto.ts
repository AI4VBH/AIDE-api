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
