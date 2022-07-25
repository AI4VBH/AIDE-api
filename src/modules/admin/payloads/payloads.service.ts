import { Injectable } from '@nestjs/common';
import { Execution } from './execution.interface';
import { Payload } from './payload.interface';

@Injectable()
export class PayloadsService {
  getPayloads(): Payload[] {
    return [
      {
        payload_id: 1,
        patient_name: 'Alex Bazin',
        patient_id: '123 123 1234',
        payload_received: '20220516T141114',
      },
      {
        payload_id: 2,
        patient_name: 'Louiza Van-Der-Varintaford',
        patient_id: '223 223 3234',
        payload_received: '20220526T050215',
      },
      {
        payload_id: 3,
        patient_name: 'Joe Batt',
        patient_id: '423 323 2235',
        payload_received: '20220611T060316',
      },
      {
        payload_id: 4,
        patient_name: 'Richard McRichardson',
        patient_id: '623 723 8234',
        payload_received: '20220620T070417',
      },
      {
        payload_id: 5,
        patient_name: 'Migle Van-Migleson',
        patient_id: '023 723 6234',
        payload_received: '20220701T080518',
      },
    ];
  }

  getPayloadExecutions(payload_id): Execution[] {
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
