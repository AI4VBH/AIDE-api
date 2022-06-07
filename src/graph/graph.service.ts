import { Injectable } from '@nestjs/common';
import { GraphDto } from './dto/graph.dto';

@Injectable()
export class GraphService {
  getGraph(): GraphDto {
    return new GraphDto();
  }
}
