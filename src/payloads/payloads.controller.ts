import { Controller, Get } from '@nestjs/common';
import { ExecutionDto } from './dto/execution.dto';
import { PayloadDto } from './dto/payload.dto';
import { PayloadsService } from './payloads.service';

@Controller('payloads')
export class PayloadsController {
  constructor(private readonly appService: PayloadsService) {}

  @Get()
  getPayloads(): PayloadDto {
    return this.appService.getPayloads();
  }

  @Get()
  getPayloadExecutions(): ExecutionDto {
    return this.appService.getPayloadExecutions();
  }
}
