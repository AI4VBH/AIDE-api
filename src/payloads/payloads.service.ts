import { Injectable } from '@nestjs/common';
import { ExecutionDto } from './dto/execution.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class PayloadsService {
  getPayloads(): PayloadDto {
    return new PayloadDto();
  }

  getPayloadExecutions(): ExecutionDto {
    return new ExecutionDto();
  }
}
