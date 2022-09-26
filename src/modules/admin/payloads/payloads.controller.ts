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
import MonaiServerExceptionFilter from 'shared/http/monai-server-exception.filter';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
@UseFilters(MonaiServerExceptionFilter)
export class PayloadsController {
  @Inject(PayloadsService)
  private readonly appService: PayloadsService;

  @Get()
  getPayloads(
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    return this.appService.getPayloads({ pageNumber, pageSize });
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id) {
    return this.appService.getPayloadExecutions(payload_id);
  }
}
