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

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpConfigService } from 'shared/http/http.service';
import { MinioClient } from 'shared/minio/minio-client';
import { GraphController } from './graph/graph.controller';
import { GraphService } from './graph/graph.service';
import { IssuesController } from './issues/issues.controller';
import { IssuesService } from './issues/issues.service';
import { LogsController } from './logs/logs.controller';
import { LogsService } from './logs/logs.service';
import { ModelsController } from './models/models.controller';
import { ModelsService } from './models/models.service';
import { OverviewController } from './overview/overview.controller';
import { OverviewService } from './overview/overview.service';
import { PayloadsController } from './payloads/payloads.controller';
import { PayloadsService } from './payloads/payloads.service';
import { ExecutionsController } from './executions/executions.controller';
import { ExecutionsService } from './executions/executions.service';
import { DestinationsController } from './destinations/destinations.controller';
import { DestinationsService } from './destinations/destinations.service';
import { ElasticClient } from 'shared/elastic/elastic-client';
import { WorkflowInstanceController } from './workflowinstances/workflowinstances.controller';
import { WorkflowInstancesService } from './workflowinstances/workflowinstances.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  controllers: [
    GraphController,
    IssuesController,
    ModelsController,
    OverviewController,
    PayloadsController,
    LogsController,
    ExecutionsController,
    DestinationsController,
    WorkflowInstanceController,
  ],
  providers: [
    GraphService,
    IssuesService,
    ModelsService,
    OverviewService,
    PayloadsService,
    LogsService,
    MinioClient,
    ExecutionsService,
    DestinationsService,
    ElasticClient,
    WorkflowInstancesService,
  ],
})
export class AdminModule {}
