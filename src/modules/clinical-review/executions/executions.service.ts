import { Injectable } from '@nestjs/common';
import { Executions, ExecutionsSearchResult } from './executions.interface';

@Injectable()
export class ExecutionsService {
  async getExecutions() {
    // console.log('searching');
    // console.log(searchResult);
    return {};
  }
}
