import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from 'test/utilities/test-make-observable';
import { WorkflowInstancesService } from './workflowinstances.service';
import { MonaiWorkflowInstance } from './workflowinstances.interface';

describe('PayloadsService', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let service: WorkflowInstancesService;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowInstancesService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<WorkflowInstancesService>(WorkflowInstancesService);
  });

  it('should be defined', () => expect(service).toBeDefined());
  describe('acknowledgeTaskError', () => {
    it('returns the expected result', async () => {
      const expectedResult: MonaiWorkflowInstance = {
        id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
        ae_title: 'some-title',
        payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
        workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
        start_time: '2022-09-22T12:45:13.102Z',
        acknowledged_workflow_errors: '2022-09-22T12:45:13.102Z',
        status: 'Succeeded',
        workflow_name: 'lillie',
        tasks: [
          {
            task_id: 'email-task',
            workflow_instance_id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
            execution_id: '981eca65-294a-434a-930a-b1828b54253a',
            previous_task_id: 'export-task',
            task_start_time: '2022-09-23T12:50:00.305Z',
            task_type: 'test',
            status: 'Failed',
            acknowledged_task_errors: '2022-09-23T12:50:00.305Z',
            reason: 'undefined',
            input_artifacts: [{ name: '', value: '' }],
            output_artifacts: [{ name: '', value: '' }],
            output_directory: 'outputdir',
            result: [{ name: '', value: '' }],
            next_timeout: '2',
            timeout_interval: 60,
          },
        ],
        bucket_id: 'bucket',
        input_metadata: [{ name: '', value: '' }],
      };

      axios.put.mockResolvedValue({ data: expectedResult });

      httpService.put.mockReturnValue(makeObservableForTest(axios.put));

      const response = await service.acknowledgeTaskError(
        'c5e980ff-e278-441b-af64-8630bf57b7e3',
        '981eca65-294a-434a-930a-b1828b54253a',
      );

      expect(response).toMatchSnapshot();
    });

    it('gets a value returns valid response', async () => {
      const expectedResult: MonaiWorkflowInstance = {
        id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
        ae_title: 'some-title',
        payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
        workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
        start_time: '2022-09-22T12:45:13.102Z',
        acknowledged_workflow_errors: '2022-09-22T12:45:13.102Z',
        status: 'Succeeded',
        workflow_name: 'lillie',
        tasks: [
          {
            task_id: 'email-task',
            workflow_instance_id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
            execution_id: '981eca65-294a-434a-930a-b1828b54253a',
            previous_task_id: 'export-task',
            task_start_time: '2022-09-23T12:50:00.305Z',
            task_type: 'test',
            status: 'Failed',
            acknowledged_task_errors: '2022-09-23T12:50:00.305Z',
            reason: 'undefined',
            input_artifacts: [{ name: '', value: '' }],
            output_artifacts: [{ name: '', value: '' }],
            output_directory: 'outputdir',
            result: [{ name: '', value: '' }],
            next_timeout: '2',
            timeout_interval: 60,
          },
        ],
        bucket_id: 'bucket',
        input_metadata: [{ name: '', value: '' }],
      };
      axios.get.mockResolvedValue({
        status: 200,
        data: [expectedResult],
      });
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const dateTimeNow = new Date().toISOString().split('T')[0];

      const response = await service.getAcknowledgedTaskErrors(dateTimeNow);

      expect(response).toMatchSnapshot();
    });
  });
});
