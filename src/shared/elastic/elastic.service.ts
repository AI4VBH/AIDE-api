import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  // constructor(private readonly searchClient: OpensearchClient) {}

  async getExecutions() {
    console.log('searching');
    // const searchResult = await this.searchClient.search<ExecutionsSearchResult>(
    //   {
    //     index: 'executions',
    //     body: {
    //       query: {
    //         match_all: {},
    //       },
    //     },
    //   },
    // );
    // console.log(searchResult);
    return {};
  }
}
