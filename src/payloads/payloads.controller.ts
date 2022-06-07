import { Controller, Get } from '@nestjs/common';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
export class PayloadsController {
  constructor(private readonly appService: PayloadsService) {}

  @Get()
  getPayloads(): string {
    return this.appService.getPayloads();
  }

  @Get()
  getPayloadExecutions(): string {
    return this.appService.getPayloadExecutions();
  }
}
