import { Controller, Put, Inject, Param, UseFilters } from '@nestjs/common';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { WorkflowInstancesService } from './workflowinstances.service';

@Controller('workflowinstances')
@UseFilters(ExternalServerExceptionFilter)
export class WorkflowInstanceController {
  @Inject(WorkflowInstancesService)
  private readonly wfiService: WorkflowInstancesService;

  @Put(':workflow_instance_id/executions/:execution_id/acknowledge')
  acknowledgeTaskError(
    @Param('workflow_instance_id') workflow_instance_id,
    @Param('execution_id') execution_id,
  ) {
    return this.wfiService.acknowledgeTaskError(
      workflow_instance_id,
      execution_id,
    );
  }
}
