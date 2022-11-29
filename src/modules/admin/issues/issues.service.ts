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

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { IMonaiPayload } from '../payloads/payload.interface';
import { MonaiWorkflowInstance } from '../workflowinstances/workflowinstances.interface';
import { IssueDto } from './issues.dto';

@Injectable()
export class IssuesService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  async getIssues(
    workflowInstances: MonaiWorkflowInstance[],
  ): Promise<IssueDto[]> {
    const payloadIds = [
      ...new Set(workflowInstances.map((wf) => wf.payload_id)),
    ];

    const promises: Promise<AxiosResponse<IMonaiPayload>>[] = [];

    for (const payloadId of payloadIds) {
      promises.push(
        lastValueFrom(
          this.httpService.get<IMonaiPayload>(`payload/${payloadId}`),
        ),
      );
    }

    const payloads = (await Promise.all(promises)).map((resp) => resp.data);

    return this.mapIssues(payloads, workflowInstances);
  }

  private mapIssues(
    payloads: IMonaiPayload[],
    workflowInstances: MonaiWorkflowInstance[],
  ): IssueDto[] {
    const issues: IssueDto[] = [];

    for (const workflowInstance of workflowInstances) {
      const relativePayload = payloads.find(
        (p) => p.payload_id == workflowInstance.payload_id,
      );

      const wfiIssues = workflowInstance.tasks
        .filter((task) => task.status === 'Failed')
        .map((task) => IssueDto.from(task, relativePayload, workflowInstance));

      issues.push(...wfiIssues);
    }

    return issues;
  }
}
