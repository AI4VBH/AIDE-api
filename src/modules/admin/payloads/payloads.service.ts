import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import PagingDTO from 'src/common/helper/paging/paging.dto';
import { IPagedResponse } from 'src/common/helper/paging/paging.interface';
import { ExecutionDTO } from './execution.dto';
import { PayloadDTO } from './payload.dto';
import {
  IMonaiPayload,
  IMonaiPayloadResponse,
  IGetPayloadsQueryParams,
} from './payload.interface';

@Injectable()
export class PayloadsService {
  constructor(private readonly httpService: HttpService) {}

  async getPayloads(
    query: IGetPayloadsQueryParams,
  ): Promise<IPagedResponse<PayloadDTO>> {
    const source = lastValueFrom(
      this.httpService.get<IMonaiPayloadResponse>(
        `payload?pageNumber=${query.pageNumber}&pageSize=${query.pageSize}`,
      ),
    );

    return await source.then((response) => {
      if (!response.data.succeeded) {
        throw new Error(
          response.data.errors?.join('\n') ?? response.data.message,
        );
      }

      return PagingDTO.fromMonaiPagedResponse<IMonaiPayload, PayloadDTO>(
        response.data,
        PayloadDTO.fromMonaiPayload,
      );
    });
  }

  getPayloadExecutions(payload_id): ExecutionDTO[] {
    switch (payload_id) {
      case 1:
        return [
          {
            execution_id: 1,
            payload_id: 1,
            model_name: 'Dicom Received',
            execution_status: 'success',
            execution_started: '20220516T141114',
            execution_finished: '20220516T141200',
            executions: [
              {
                execution_id: 2,
                payload_id: 1,
                model_name: '3D Fetal Body MRI',
                execution_status: 'success',
                execution_started: '20220516T141200',
                execution_finished: '20220516T150000',
                executions: [
                  {
                    execution_id: 2,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220516T150000',
                    execution_finished: '20220516T150234',
                    executions: [],
                  },
                ],
              },
              {
                execution_id: 3,
                payload_id: 1,
                model_name: '3D Fetal Brain MRI',
                execution_status: 'success',
                execution_started: '20220516T141200',
                execution_finished: '20220516T151440',
                executions: [
                  {
                    execution_id: 2,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220516T151440',
                    execution_finished: '20220516T151540',
                    executions: [],
                  },
                ],
              },
              {
                execution_id: 4,
                payload_id: 1,
                model_name: '3D Fetal Heart MRI',
                execution_status: 'success',
                execution_started: '20220516T141200',
                execution_finished: '20220516T150000',
                executions: [
                  {
                    execution_id: 2,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220516T150000',
                    execution_finished: '20220516T152614',
                    executions: [],
                  },
                ],
              },
            ],
          },
        ];
      case 2:
        return [
          {
            execution_id: 1,
            payload_id: 2,
            model_name: 'Dicom Received',
            execution_status: 'success',
            execution_started: '20220526T050215',
            execution_finished: '20220526T050312',
            executions: [
              {
                execution_id: 2,
                payload_id: 2,
                model_name: 'Stroke Pathway',
                execution_status: 'success',
                execution_started: '20220526T050312',
                execution_finished: '20220526T052232',
                executions: [
                  {
                    execution_id: 2,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220526T052232',
                    execution_finished: '20220526T052312',
                    executions: [],
                  },
                ],
              },
            ],
          },
        ];
      case 3:
        return [
          {
            execution_id: 1,
            payload_id: 3,
            model_name: 'Dicom Received',
            execution_status: 'success',
            execution_started: '20220611T060316',
            execution_finished: '20220611T060446',
            executions: [
              {
                execution_id: 2,
                payload_id: 3,
                model_name: 'Brainminer CT',
                execution_status: 'success',
                execution_started: '20220611T060446',
                execution_finished: '20220611T063326',
                executions: [
                  {
                    execution_id: 2,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220611T063326',
                    execution_finished: '20220611T063446',
                    executions: [],
                  },
                ],
              },
            ],
          },
        ];
      case 4:
        return [
          {
            execution_id: 1,
            payload_id: 4,
            model_name: 'Dicom Received',
            execution_status: 'success',
            execution_started: '20220620T070417',
            execution_finished: '20220620T070527',
            executions: [
              {
                execution_id: 2,
                payload_id: 4,
                model_name: 'MR Spectroscopy',
                execution_status: 'success',
                execution_started: '20220620T070527',
                execution_finished: '20220620T073712',
                executions: [
                  {
                    execution_id: 2,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220620T073712',
                    execution_finished: '20220620T073812',
                    executions: [],
                  },
                ],
              },
            ],
          },
        ];
      case 5:
        return [
          {
            execution_id: 1,
            payload_id: 5,
            model_name: 'Dicom Received',
            execution_status: 'success',
            execution_started: '20220701T080518',
            execution_finished: '20220701T080618',
            executions: [
              {
                execution_id: 2,
                payload_id: 5,
                model_name: '3D Fetal Body MRI',
                execution_status: 'success',
                execution_started: '20220701T080618',
                execution_finished: '20220701T085228',
                executions: [
                  {
                    execution_id: 4,
                    payload_id: 5,
                    model_name: 'Output Sent to Destination',
                    execution_status: 'success',
                    execution_started: '20220701T085228',
                    execution_finished: '20220701T085318',
                    executions: [],
                  },
                ],
              },
              {
                execution_id: 3,
                payload_id: 5,
                model_name: '3D Fetal Heart MRI',
                execution_status: 'error',
                execution_started: '20220701T080618',
                execution_finished: '20220701T080818',
                executions: [],
              },
            ],
          },
        ];

      default:
        return [];
    }
  }
}
