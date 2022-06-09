import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';

@Module({
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
