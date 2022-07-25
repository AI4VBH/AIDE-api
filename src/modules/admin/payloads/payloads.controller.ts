import { Controller, Get, Param } from '@nestjs/common';
import { Execution } from './execution.interface';
import { Payload } from './payload.interface';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
export class PayloadsController {
  constructor(private readonly appService: PayloadsService) {}

  @Get()
  getPayloads(): Payload[] {
    return this.appService.getPayloads();
  }

  @Get(':payload_id/executions')
  getPayloadExecutions(@Param('payload_id') payload_id): Execution[] {
    return this.appService.getPayloadExecutions(payload_id);
  }
}
