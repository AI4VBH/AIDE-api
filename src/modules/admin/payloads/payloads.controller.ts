import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { IPagedResponse } from 'src/common/helper/paging/paging.interface';
import { ExecutionDTO } from './execution.dto';
import { PayloadDTO } from './payload.dto';
import { IGetPayloadsQueryParams } from './payload.interface';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
export class PayloadsController {
  constructor(private readonly appService: PayloadsService) {}

  @Get()
  async getPayloads(
    @Query() query: IGetPayloadsQueryParams,
  ): Promise<IPagedResponse<PayloadDTO>> {
    if (!query.pageNumber || !query.pageSize) {
      throw new BadRequestException(
        'pageNumber and pageSize are both required query parameters.',
      );
    }

    return await this.appService.getPayloads(query);
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id): ExecutionDTO[] {
    return this.appService.getPayloadExecutions(payload_id);
  }
}
