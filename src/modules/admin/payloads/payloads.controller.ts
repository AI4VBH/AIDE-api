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
    if (query) {
      validateParam(query.pageNumber, 'pageNumber');
      validateParam(query.pageSize, 'pageSize');
    }

    try {
      return await this.appService.getPayloads(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id): ExecutionDTO[] {
    return this.appService.getPayloadExecutions(payload_id);
  }
}

const validateParam = (param: string, label: string) => {
  if (param) {
    const number = Number(param);

    if (isNaN(number)) {
      throw new BadRequestException(
        `${label} must be a numerical value`
      );
    }

    if (number < 1) {
      throw new BadRequestException(
        `${label} must be a minimum of 1`,
      );
    }
  }
}