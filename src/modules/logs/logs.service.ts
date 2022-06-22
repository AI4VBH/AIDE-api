import { Injectable } from '@nestjs/common';
import { Log } from './log.interface';

@Injectable()
export class LogsService {
  getLog(): Log {
    return {} as Log;
  }
}
