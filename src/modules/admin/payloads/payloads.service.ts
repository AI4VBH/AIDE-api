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
import { lastValueFrom } from 'rxjs';
import PagingDTO from 'shared/helper/paging/paging.dto';
import { IPagedResponse } from 'shared/helper/paging/paging.interface';
import { MonaiWorkflowInstance } from '../workflowinstances/workflowinstances.interface';
import { PayloadDTO } from './payload.dto';
import {
  IMonaiPayload,
  IMonaiPayloadResponse,
  IGetPayloadsQueryParams,
} from './payload.interface';
import { mapWorkflowInstancesToExecutions } from './payloads.mapper';

@Injectable()
export class PayloadsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  async getPayloads(
    query: IGetPayloadsQueryParams,
    patientName: string,
    patientId: string,
  ): Promise<IPagedResponse<PayloadDTO>> {
    const queryParams = new URLSearchParams(
      query as unknown as Record<string, string>,
    );

    if (patientName) {
      queryParams.append('patientName', patientName);
    }

    if (patientId) {
      queryParams.append('patientId', patientId);
    }

    const url = `payload?${queryParams}`;

    const response = await lastValueFrom(
      this.httpService.get<IMonaiPayloadResponse>(url),
    );

    if (!response.data.succeeded) {
      throw new Error(
        response.data.errors?.join('\n') ?? response.data.message,
      );
    }

    return PagingDTO.fromMonaiPagedResponse<IMonaiPayload, PayloadDTO>(
      response.data,
      PayloadDTO.fromMonaiPayload,
    );
  }

  async getPayloadExecutions(payload_id) {
    const params = new URLSearchParams({
      payloadId: payload_id,
      disablePagination: 'true',
    });

    const response = await lastValueFrom(
      this.httpService.get<MonaiWorkflowInstance[]>(
        `/workflowinstances?${params}`,
      ),
    );

    return mapWorkflowInstancesToExecutions(response.data);
  }
}
