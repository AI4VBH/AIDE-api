import { Controller, Get, Param, Query } from '@nestjs/common';
import { GraphDTO } from './graph.dto';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  getGraph(
    @Param('model_id') model_id,
    @Query('start_date') start_date,
    @Query('end_date') end_date,
  ): GraphDTO {
    return this.graphService.getGraph(model_id, start_date, end_date);
  }
}
