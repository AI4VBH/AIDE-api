import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphService {
  getGraph(): string {
    return 'Hello World!';
  }
}
