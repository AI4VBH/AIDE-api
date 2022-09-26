import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import PagingDTO from 'shared/helper/paging/paging.dto';
import { IPagedResponse } from 'shared/helper/paging/paging.interface';
import { PayloadDTO } from './payload.dto';
import {
  IMonaiPayload,
  IMonaiPayloadResponse,
  IGetPayloadsQueryParams,
  MonaiWorkflowInstance,
} from './payload.interface';
import { mapWorkflowInstancesToExecutions } from './payloads.mapper';

@Injectable()
export class PayloadsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  async getPayloads(
    query: IGetPayloadsQueryParams,
  ): Promise<IPagedResponse<PayloadDTO>> {
    const queryParams = new URLSearchParams(
      query as unknown as Record<string, string>,
    );

    const response = await lastValueFrom(
      this.httpService.get<IMonaiPayloadResponse>(`payload?${queryParams}`),
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
