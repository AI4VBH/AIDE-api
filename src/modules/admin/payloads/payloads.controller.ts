import { Controller, Get, Param } from '@nestjs/common';
import { ExecutionDTO } from './execution.dto';
import { PayloadDTO } from './payload.interface';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
export class PayloadsController {
  constructor(private readonly appService: PayloadsService) {}

  @Get()
  getPayloads(): PayloadDTO[] {
    return this.appService.getPayloads();
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id): ExecutionDTO[] {
    return this.appService.getPayloadExecutions(payload_id);
  }
}
