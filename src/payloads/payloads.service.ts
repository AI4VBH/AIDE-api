import { Injectable } from '@nestjs/common';

@Injectable()
export class PayloadsService {
  getPayloads(): string {
    return 'Hello World!';
  }

  getPayloadExecutions(): string {
    return 'Hello World!';
  }
}
