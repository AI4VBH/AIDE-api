import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IGetPayloadsQueryParams } from './payload.interface';
import { PayloadsController } from './payloads.controller';
import { PayloadsService } from './payloads.service';

describe('PayloadsController', () => {
  let service: DeepMocked<PayloadsService>;
  let controller: PayloadsController;

  beforeEach(async () => {
    service = createMock<PayloadsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayloadsController],
      providers: [
        {
          provide: PayloadsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<PayloadsController>(PayloadsController);
  });

  it('should be defined', () => expect(controller).toBeDefined());

  describe('getPayloads', () => {
    it.each([
      { pageNumber: '0', pageSize: '0' },
      { pageNumber: '0', pageSize: '10' },
    ])(
      'throws bad request when either query string parameter is not a minimum of 1: %s',
      async (queryParams: IGetPayloadsQueryParams) => {
        const action = async () => await controller.getPayloads(queryParams);

        await expect(action()).rejects.toThrowError(BadRequestException);
      },
    );

    it('returns the expected valid response', async () => {
      const expectedResult = {
        pageNumber: 1,
        pageSize: 10,
        firstPage: '//payload?pageNumber=1&pageSize=10',
        lastPage: '//payload?pageNumber=1&pageSize=10',
        totalPages: 1,
        totalRecords: 3,
        nextPage: null,
        previousPage: null,
        data: [
          {
            payload_id: '86c0f117-4021-412e-b163-0dc621df672a',
            patient_id: '1d0253c4-8fab-41df-a414-55d52e4c6c3f',
            patient_name: 'Jane Doe',
            payload_received: '2022-08-17T12:21:10.203Z',
          },
          {
            payload_id: '30a8e0c6-e6c4-458f-aa4d-b224b493d3c0',
            patient_id: '',
            patient_name: '',
            payload_received: '2022-08-17T12:21:10.203Z',
          },
          {
            payload_id: 'c5c3636b-81dd-44a9-8c4b-71adec7d47b2',
            patient_id: 'fd1bebf4-d690-4fc5-a0d8-4fd4701ff4c9',
            patient_name: 'Steve Jobs',
            payload_received: '2022-08-17T12:21:10.2Z',
          },
        ],
      };

      service.getPayloads.mockResolvedValue(expectedResult);

      const response = await controller.getPayloads({
        pageNumber: '1',
        pageSize: '10',
      });

      expect(response).toStrictEqual(expectedResult);
    });
  });
});
