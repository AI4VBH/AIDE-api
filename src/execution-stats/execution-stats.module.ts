import { Module } from '@nestjs/common';
import { ExecutionStatsController } from './execution-stats.controller';
import { ExecutionStatsService } from './execution-stats.service';

@Module({
  controllers: [ExecutionStatsController],
  providers: [ExecutionStatsService],
})
export class ExecutionStatsModule {}
