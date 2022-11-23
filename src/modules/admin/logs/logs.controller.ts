import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseFilters,
} from '@nestjs/common';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { LogsService } from './logs.service';

@Controller('logs')
@UseFilters(ExternalServerExceptionFilter)
export class LogsController {
  constructor(private readonly appService: LogsService) {}

  @Get(':id')
  getLogs(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('id param cannot be empty');
    }
    return this.appService.getLogByTask(id);
  }
}
