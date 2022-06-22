import { Injectable } from '@nestjs/common';
import { ExecutionStat } from './overview.interface';

@Injectable()
export class OverviewService {
  getOverview(): ExecutionStat {
    return {} as ExecutionStat;
  }
}
