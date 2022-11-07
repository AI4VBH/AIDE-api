import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { ExecutionsService } from './executions.service';

@Controller('executions')
@UseFilters(ExternalServerExceptionFilter)
export class ExecutionsController {
  @Inject(ExecutionsService)
  private readonly executionsService: ExecutionsService;

  @Get(':workflow_instance_id/tasks/:execution_id/artifacts')
  async getWorkflowInstanceArtifacts(
    @Param('workflow_instance_id') workflowInstanceId: string,
    @Param('execution_id', ParseUUIDPipe) executionId: string,
  ) {
    return await this.executionsService.getWorkflowInstanceArtifacts(
      workflowInstanceId,
      executionId,
    );
  }

  @Get('artifact-download')
  async getArtifactDownloadUrl(@Query('key') file: string, @Res() response) {
    if (!file || !file.trim()) {
      throw new BadRequestException('key query value is missing');
    }

    const fileStream = await this.executionsService.getArtifact(file);
    return fileStream.pipe(response);
  }

  @Get(':workflow_instance_id/tasks/:execution_id/metadata')
  getWorkflowInstanceMetadata(
    @Param('workflow_instance_id') workflowInstanceId: string,
    @Param('execution_id', ParseUUIDPipe) executionId: string,
  ) {
    return this.executionsService.getWorkflowInstanceMetadata(
      workflowInstanceId,
      executionId,
    );
  }
}
