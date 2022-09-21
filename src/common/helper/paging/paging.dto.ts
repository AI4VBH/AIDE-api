import { IPagedMonaiResponse, IPagedResponse } from './paging.interface';

export default class PagingDTO {
  static fromMonaiPagedResponse<T, U>(
    response: IPagedMonaiResponse<T>,
    dataTransformCallback: (monaiDataModel: T) => U,
  ): IPagedResponse<U> {
    return {
      pageNumber: response.pageNumber,
      pageSize: response.pageSize,
      firstPage: response.firstPage,
      lastPage: response.lastPage,
      totalPages: response.totalPages,
      totalRecords: response.totalRecords,
      nextPage: response.nextPage,
      previousPage: response.previousPage,
      data: response.data.map((entity) => dataTransformCallback(entity)),
    };
  }
}
