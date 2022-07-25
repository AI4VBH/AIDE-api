import { Controller, Get } from '@nestjs/common';
import { Logs } from './log.interface';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly appService: LogsService) {}

  @Get()
  getHello(): Logs[] {
    return this.appService.getLog();
  }
}
