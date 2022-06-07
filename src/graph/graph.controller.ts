import { Controller, Get } from '@nestjs/common';
import { GraphDto } from './dto/graph.dto';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  getHello(): GraphDto {
    return this.graphService.getGraph();
  }
}
