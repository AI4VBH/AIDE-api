import { Injectable } from '@nestjs/common';
import { ExecutionStatsDto } from './dto/execution-stats.dto';

@Injectable()
export class ExecutionStatsService {
  getExecutionStats(): ExecutionStatsDto {
    return new ExecutionStatsDto();
  }
}
