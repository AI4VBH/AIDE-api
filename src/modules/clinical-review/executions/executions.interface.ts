export interface Executions {
  hits: {
    total: number;
    hits: Array<{
      _source: any;
    }>;
  };
}

export interface ExecutionsSearchBody {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export interface ExecutionsSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: any;
    }>;
  };
}
