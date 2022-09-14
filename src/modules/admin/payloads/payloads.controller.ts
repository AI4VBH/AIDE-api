import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { IPagedResponse } from 'common/helper/paging/paging.interface';
import { ExecutionDTO } from './execution.dto';
import { PayloadDTO } from './payload.dto';
import { IGetPayloadsQueryParams } from './payload.interface';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
export class PayloadsController {
  @Inject(PayloadsService)
  private readonly appService: PayloadsService;

  @Get()
  async getPayloads(
    @Query() query: IGetPayloadsQueryParams,
  ): Promise<IPagedResponse<PayloadDTO>> {
    if (!query || !query.pageNumber || !query.pageSize) {
      throw new BadRequestException(
        'pageNumber and pageSize are both required query parameters.',
      );
    }

    if (query.pageNumber < 1 || query.pageSize < 1) {
      throw new BadRequestException(
        'pageNumber and pageSize must both be a minimum of 1.',
      );
    }

    return await this.appService.getPayloads(query);
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id): ExecutionDTO[] {
    return this.appService.getPayloadExecutions(payload_id);
  }
}
