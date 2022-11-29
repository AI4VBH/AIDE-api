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

import * as noArtifacts from './workflow-instance-no-artifacts.json';
import * as withArtifacts from './workflow-instance-with-artifacts.json';
import * as nonExistentWorkflow from './non-existent-workflow-get-error.json';
import * as nonExistentExecutionId from './non-existent-execution-id.json';
import * as invalidWorkflowId from './invalid-workflow-id.json';
import * as metadata from './metadata.json';
import * as metadataEmpty from './metadata-empty.json';

export default {
  noArtifacts,
  withArtifacts,
  nonExistentWorkflow,
  nonExistentExecutionId,
  invalidWorkflowId,
  metadata,
  metadataEmpty,
};
