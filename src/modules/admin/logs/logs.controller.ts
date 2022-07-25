import { Controller, Get } from '@nestjs/common';
import { LogsDTO } from './log.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly appService: LogsService) {}

  @Get()
  getHello(): LogsDTO[] {
    return this.appService.getLog();
  }
}
