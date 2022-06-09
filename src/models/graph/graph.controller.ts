import { Controller, Get } from '@nestjs/common';
import { Graph } from './graph.interface';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  getHello(): Graph {
    return this.graphService.getGraph();
  }
}
