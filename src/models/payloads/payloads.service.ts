import { Injectable } from '@nestjs/common';
import { Execution } from './execution.interface';
import { Payload } from './payload.interface';

@Injectable()
export class PayloadsService {
  getPayloads(): Payload {
    return {} as Payload;
  }

  getPayloadExecutions(): Execution {
    return {} as Execution;
  }
}
