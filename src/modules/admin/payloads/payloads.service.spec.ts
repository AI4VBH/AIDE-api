import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PayloadsService } from './payloads.service';
import * as mockMonaiPayloadsResponse from 'test/test_data/mocks/payloads/basic-payloads-1.json';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from 'test/utilities/test-make-observable';
import {
  MonaiWorkflowInstance,
  MonaiWorkflowTask,
} from '../workflowinstances/workflowinstances.interface';

describe('PayloadsService', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let service: PayloadsService;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayloadsService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<PayloadsService>(PayloadsService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('getPayloads', () => {
    it('throws an error if the monai request is unsuccessful', async () => {
      axios.get.mockResolvedValue({
        status: 404,
        data: {
          succeeded: false,
          errors: ['Example error message 1', 'Example error message 2'],
        },
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const action = async () =>
        await service.getPayloads(
          {
            pageNumber: 1,
            pageSize: 10,
          },
          undefined,
          undefined,
        );

      await expect(action()).rejects.toThrowError();
      expect(httpService.get).toHaveBeenCalled();
    });

    it('returns the expected result', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        statusText: 'Success',
        config: {},
        headers: {},
        data: mockMonaiPayloadsResponse,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const response = await service.getPayloads(
        {
          pageNumber: 1,
          pageSize: 10,
        },
        undefined,
        undefined,
      );

      expect(response).toMatchSnapshot();
    });

    it('returns the expected result with patient name and id params', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        statusText: 'Success',
        config: {},
        headers: {},
        data: mockMonaiPayloadsResponse,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const response = await service.getPayloads(
        {
          pageNumber: 1,
          pageSize: 10,
        },
        '2',
        'jack',
      );

      expect(response).toMatchSnapshot();
    });
  });

  describe('getPayloadExecutions', () => {
    it('returns expected result', async () => {
      const instances: MonaiWorkflowInstance[] = [
        {
          id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
          ae_title: 'some-title',
          payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
          workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
          start_time: '2022-09-22T12:45:13.102Z',
          status: 'Succeeded',
          tasks: [
            {
              task_id: 'some-special-task',
              workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
              execution_id: '981eca65-294a-434a-930a-b1828b54253a',
              previous_task_id: '',
              status: 'Suceeded',
              task_start_time: '2022-09-23T12:50:00.305Z',
            } as MonaiWorkflowTask,
            {
              task_id: 'export-task',
              workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
              execution_id: '981eca65-294a-434a-930a-b1828b54253a',
              previous_task_id: 'some-special-task',
              status: 'Suceeded',
              task_start_time: '2022-09-23T12:50:00.305Z',
            } as MonaiWorkflowTask,
            {
              task_id: 'email-task',
              workflow_instance_id: 'e02e3bbc-a760-4d83-8cfe-ce3a77424171',
              execution_id: '981eca65-294a-434a-930a-b1828b54253a',
              previous_task_id: 'export-task',
              status: 'Suceeded',
              task_start_time: '2022-09-23T12:50:00.305Z',
            } as MonaiWorkflowTask,
          ],
        } as MonaiWorkflowInstance,
      ];

      axios.get.mockResolvedValue({
        status: 200,
        data: instances,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getPayloadExecutions(
        '260ce283-6257-4efb-9965-b4f529e248d6',
      );

      expect(result).toMatchSnapshot();
    });
  });
});
