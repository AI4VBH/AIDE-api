import { Injectable } from '@nestjs/common';
import { Graph } from './graph.interface';

@Injectable()
export class GraphService {
  getGraph(): Graph {
    return {} as Graph;
  }
}
