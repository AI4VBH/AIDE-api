/*
 * Copyright 2022 Crown Copyright
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

import * as failedTasks1 from './failed-tasks-1.json';
import * as failedTasks2 from './failed-tasks-2.json';
import * as payload1 from './payload-1.json';
import * as payload2 from './payload-2.json';
import * as payload3 from './payload-3.json';
import * as noUnacknowledgedTasksError from './no-unacknowledged-tasks-error.json';
import * as noMatchingPayload from './no-matching-payload.json';
import * as invalidPayloadId from './failed-tasks-invalid-guid.json';
import * as invalidPayloadError from './invalid-payload-error.json';
import * as invalidDate from './invalid-date.json';

export default {
  failedTasks1,
  failedTasks2,
  payload1,
  payload2,
  payload3,
  noUnacknowledgedTasksError,
  noMatchingPayload,
  invalidPayloadId,
  invalidPayloadError,
  invalidDate,
};
