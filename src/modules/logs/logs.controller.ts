import { Controller, Get } from '@nestjs/common';
import { Log } from './log.interface';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly appService: LogsService) {}

  @Get()
  getHello(): Log {
    return this.appService.getLog();
  }
}
