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
import MonaiServerExceptionFilter from 'shared/http/monai-server-exception.filter';
import { CreateEditWorkflowDto } from './dto/aide-workflow.dto';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
@UseFilters(MonaiServerExceptionFilter)
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
  createWorkflow(@Body() createWorkflow: CreateEditWorkflowDto) {
    return this.service.createWorkflow(createWorkflow.workflow);
  }

  @Put(':workflowId')
  editWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() editWorkflow: CreateEditWorkflowDto,
  ) {
    return this.service.editWorkflow(workflowId, editWorkflow.workflow);
  }

  @Delete(':workflowId')
  deleteWorkflowById(@Param('workflowId') workflowId: string) {
    return this.service.deleteWorkflow(workflowId);
  }
}
