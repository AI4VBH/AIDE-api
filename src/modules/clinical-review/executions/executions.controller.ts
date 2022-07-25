import { Controller, Get } from '@nestjs/common';
import { Executions, ExecutionsSearchResult } from './executions.interface';
import { ExecutionsService } from './executions.service';

@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Get()
  async getModels() {
    return await this.executionsService.getExecutions();
  }
}
