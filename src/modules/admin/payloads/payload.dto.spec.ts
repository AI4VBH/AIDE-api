import { PayloadDTO } from './payload.dto';
import * as mockMonaiPayload from 'test/test_data/mocks/payloads/single-payload.json';

describe('PayloadDTO', () => {
  test('fromMonaiPayload returns the expected result', () => {
    const expectedResult = {
      payload_id: '86c0f117-4021-412e-b163-0dc621df672a',
      patient_id: '1d0253c4-8fab-41df-a414-55d52e4c6c3f',
      patient_name: 'Jane Doe',
      payload_received: '2022-08-17T12:21:10.203Z',
    };

    const response = PayloadDTO.fromMonaiPayload(mockMonaiPayload);

    expect(response).toEqual(expectedResult);
  });
});
