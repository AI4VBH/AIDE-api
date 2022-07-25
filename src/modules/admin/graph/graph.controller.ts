import { Controller, Get, Param, Query } from '@nestjs/common';
import { Graph } from './graph.interface';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  getGraph(
    @Param('model_id') model_id,
    @Query('start_date') start_date,
    @Query('end_date') end_date,
  ): Graph {
    return this.graphService.getGraph(model_id, start_date, end_date);
  }
}
