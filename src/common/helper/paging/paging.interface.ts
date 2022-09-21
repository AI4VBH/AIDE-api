export interface IPagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  firstPage: string;
  lastPage: string;
  totalPages: number;
  totalRecords: number;
  nextPage: string;
  previousPage: string;
  data: T[];
}

export interface IPagedMonaiResponse<T> extends IPagedResponse<T> {
  succeeded: boolean;
  errors: string[];
  message: string;
}
