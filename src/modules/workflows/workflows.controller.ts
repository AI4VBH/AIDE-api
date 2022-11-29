import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import {
  CreateWorkflowDto,
  EditWorkflowDto,
  WorkflowDto,
} from './dto/aide-workflow.dto';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
@Roles({ roles: ['realm:admin'] })
@UseFilters(ExternalServerExceptionFilter)
export class WorkflowsController {
  @Inject(WorkflowsService)
  private readonly service: WorkflowsService;

  @Get()
  getWorkflows(
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    return this.service.getPagedWorkflows(pageNumber, pageSize);
  }

  @Get(':workflowId')
  getWorkflowById(@Param('workflowId') workflowId: string) {
    return this.service.getWorkflowDetail(workflowId);
  }

  @Post()
  createWorkflow(@Body() createWorkflow: CreateWorkflowDto) {
    const { workflow } = createWorkflow;

    this.validateWorkflow(workflow);

    return this.service.createWorkflow(workflow);
  }

  @Put(':workflowId')
  editWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() editWorkflow: EditWorkflowDto,
  ) {
    const { workflow } = editWorkflow.workflow;
    const { original_workflow_name } = editWorkflow;

    this.validateWorkflow(workflow);

    return this.service.editWorkflow(
      workflowId,
      workflow,
      original_workflow_name,
    );
  }

  @Delete(':workflowId')
  deleteWorkflowById(@Param('workflowId') workflowId: string) {
    return this.service.deleteWorkflow(workflowId);
  }

  private validateWorkflow(workflow: Partial<WorkflowDto>) {
    if (!workflow || !workflow.informatics_gateway) {
      throw new BadRequestException('workflow object cannot be empty');
    }

    if (
      !workflow.informatics_gateway.ae_title ||
      !workflow.informatics_gateway.export_destinations
    ) {
      throw new BadRequestException('ae_title or export_destination missing');
    }
  }
}
