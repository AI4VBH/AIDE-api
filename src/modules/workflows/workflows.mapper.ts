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

import {
  PagedWorkflowsDto,
  PagedWorkflowsItemDto,
} from './dto/aide-workflow.dto';
import {
  MonaiWorkflow,
  PagedMonaiWorkflows,
} from './monai-workflow.interfaces';

export function mapToPagedWorkflowsDto(
  paged: PagedMonaiWorkflows,
): PagedWorkflowsDto {
  if (!paged) {
    throw new Error('paged is null or undefined');
  }

  return {
    totalPages: paged.totalPages,
    totalRecords: paged.totalRecords,
    data: paged.data.map((w) => mapToPagedWorkflowsItemDto(w)),
  };
}

export function mapToPagedWorkflowsItemDto(
  workflow: MonaiWorkflow,
): PagedWorkflowsItemDto {
  return {
    id: workflow.id,
    workflow_id: workflow.workflow_id,
    revision: workflow.revision,
    name: workflow.workflow.name,
    description: workflow.workflow.description,
    version: workflow.workflow.version,
    ae_title: workflow.workflow.informatics_gateway.ae_title,
    data_origins: workflow.workflow.informatics_gateway.data_origins,
  };
}
