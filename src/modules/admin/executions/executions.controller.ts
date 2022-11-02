import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Query,
  Redirect,
  UseFilters,
} from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
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
    return this.executionsService.getWorkflowInstanceArtifacts(
      workflowInstanceId,
      executionId,
    );
  }

  @Get('artifact-download')
  @Public()
  @Redirect()
  async getArtifactDownloadUrl(@Query('key') file: string) {
    const logger = new Logger('ArtifactDownload');

    if (!file || !file.trim()) {
      throw new BadRequestException('key query value is missing');
    }

    logger.log(`Generating pre-signed url for key: '${file}'`);
    const url = await this.executionsService.getArtifactUrl(file);
    logger.log(`Pre-signed URL generated: ${url}`);

    return { url };
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
