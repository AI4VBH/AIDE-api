import PagingDTO from './paging.dto';
import * as mockMonaiPayloadResponse from 'test/test_data/mocks/payloads/basic-payload-1.json';
import { IMonaiPayload } from 'modules/admin/payloads/payload.interface';
import { PayloadDTO } from 'modules/admin/payloads/payload.dto';

describe('PagingDTO', () => {
  test('fromMonaiPagedResponse returns the expected result', () => {
    const expectedResult = {
      pageNumber: 1,
      pageSize: 10,
      firstPage: '//payload?pageNumber=1&pageSize=10',
      lastPage: '//payload?pageNumber=1&pageSize=10',
      totalPages: 1,
      totalRecords: 3,
      nextPage: null,
      previousPage: null,
      data: [
        {
          payload_id: '86c0f117-4021-412e-b163-0dc621df672a',
          patient_id: '1d0253c4-8fab-41df-a414-55d52e4c6c3f',
          patient_name: 'Jane Doe',
          payload_received: '2022-08-17T12:21:10.203Z',
        },
        {
          payload_id: '30a8e0c6-e6c4-458f-aa4d-b224b493d3c0',
          patient_id: '',
          patient_name: '',
          payload_received: '2022-08-17T12:21:10.203Z',
        },
        {
          payload_id: 'c5c3636b-81dd-44a9-8c4b-71adec7d47b2',
          patient_id: 'fd1bebf4-d690-4fc5-a0d8-4fd4701ff4c9',
          patient_name: 'Steve Jobs',
          payload_received: '2022-08-17T12:21:10.2Z',
        },
      ],
    };

    const response = PagingDTO.fromMonaiPagedResponse<
      IMonaiPayload,
      PayloadDTO
    >(mockMonaiPayloadResponse, PayloadDTO.fromMonaiPayload);

    expect(response).toEqual(expectedResult);
  });
});
