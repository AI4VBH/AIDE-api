import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from 'test/utilities/test-make-observable';
import { IMonaiPayload } from '../payloads/payload.interface';
import { MonaiWorkflowInstance } from '../workflowinstances/workflowinstances.interface';
import { IssuesService } from './issues.service';

describe('IssuesServices', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let service: IssuesService;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuesService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<IssuesService>(IssuesService);
  });

  it('should be defined', () => expect(service).toBeDefined());
  describe('get expected issues', () => {
    it('returns the expected result', async () => {
      const givenWorkflowInstances: MonaiWorkflowInstance[] = [
        {
          id: 'c5e980ff-e278-441b-af64-8630bf57b7e3',
          ae_title: 'some-title',
          payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
          workflow_id: 'fca60a4d-2932-4196-9206-cf123c82332b',
          start_time: '2022-09-22T12:45:13.102Z',
          acknowledged_workflow_errors: '2022-09-22T12:45:13.102Z',
          status: 'Failed',
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
          workflow_name: 'lillie',
        },
      ];

      const expectedPayload: IMonaiPayload = {
        id: 'Id',
        payload_id: '041293d0-ab97-4ea1-b967-42ec62f26608',
        workflows: [],
        workflow_instance_ids: ['c5e980ff-e278-441b-af64-8630bf57b7e3'],
        file_count: 0,
        correlation_id: 'd37b8de8-e265-504d-8ab3-bdbff199d206xx',
        bucket: 'bucket',
        calling_aetitle: 'B99E00',
        called_aetitle: '484406',
        timestamp: '2022-04-14T16:25:37+01:00',
        files: [],
        patient_details: {
          patient_id: '29FA59',
          patient_name: 'Rebecca',
          patient_sex: 'Franklin',
          patient_dob: '20/08/2022',
          patient_age: '25',
          patient_hospital_id: 'Buvveho',
        },
      };

      axios.get.mockResolvedValue({ data: expectedPayload });
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const response = await service.getIssues(givenWorkflowInstances);

      expect(response).toMatchSnapshot();
    });
  });
});