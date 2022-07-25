import { Injectable } from '@nestjs/common';
import { OverviewDTO } from './overview.dto';

@Injectable()
export class OverviewService {
  getOverview(period): OverviewDTO {
    switch (period) {
      case 'day':
        return {
          deployed_models: 6,
          model_executions: 57,
          model_failures: 0,
        };
      case 'week':
        return {
          deployed_models: 6,
          model_executions: 254,
          model_failures: 10,
        };
      case 'month':
        return {
          deployed_models: 6,
          model_executions: 757,
          model_failures: 54,
        };
      default:
        return {
          deployed_models: 0,
          model_executions: 0,
          model_failures: 0,
        };
    }
  }
}
