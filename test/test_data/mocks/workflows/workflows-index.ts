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

import * as basicWorkflows1 from './basic-workflows-1.json';
import * as basicWorkflows2 from './basic-workflows-2.json';
import * as basicWorkflows3 from './basic-workflows-3.json';
import * as basicWorkflows4 from './basic-workflows-4.json';
import * as singleWorkflow1 from './single-workflow-1.json';

import * as singleWorkflow2 from './single-workflow-2.json';
import * as singleWorkflow3 from './single-workflow-3.json';
import * as nonExistentGetWorkflowError from './non-existent-workflow-get-error.json';
import * as nonExistentPutWorkflowError from './non-existent-workflow-put-error.json';
import * as invalidWorkflowIdError from './invalid-workflowid-error.json';

import * as invalidWorkflowBodyError from './invalid-workflow-body-error.json';
import * as emptyWorkflowData from './empty-workflow-data.json';
import * as postPutResponse from './post-put-response.json';
import * as invalidBodyAETitle from './invalid-body-aetitle.json';
import * as existsAETitle from './exists-aetitle.json';

import * as createdAETitle from './created-aetitle.json';
import * as basicDestination1 from './basic-destination-1.json';
import * as basicDestination2 from './basic-destination-2.json';

export default {
  basicWorkflows1,
  basicWorkflows2,
  basicWorkflows3,
  basicWorkflows4,
  singleWorkflow1,
  singleWorkflow2,
  singleWorkflow3,
  nonExistentGetWorkflowError,
  nonExistentPutWorkflowError,
  invalidWorkflowIdError,
  invalidWorkflowBodyError,
  emptyWorkflowData,
  postPutResponse,
  invalidBodyAETitle,
  existsAETitle,
  createdAETitle,
  basicDestination1,
  basicDestination2,
};
