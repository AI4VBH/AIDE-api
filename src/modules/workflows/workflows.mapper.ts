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
