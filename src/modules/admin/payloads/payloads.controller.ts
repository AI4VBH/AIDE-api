import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
} from '@nestjs/common';
import MonaiServerExceptionFilter from 'common/filters/monai-server-exception.filter';
import { ExecutionDTO } from './execution.dto';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
@UseFilters(MonaiServerExceptionFilter)
export class PayloadsController {
  @Inject(PayloadsService)
  private readonly appService: PayloadsService;

  @Get()
  async getPayloads(
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    return await this.appService.getPayloads({ pageNumber, pageSize });
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id): ExecutionDTO[] {
    return this.appService.getPayloadExecutions(payload_id);
  }
}
