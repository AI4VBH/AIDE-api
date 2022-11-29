/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
