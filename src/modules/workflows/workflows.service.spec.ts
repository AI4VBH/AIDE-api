import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from '../../../test/utilities/test-make-observable';
import { PagedMonaiWorkflows } from './monai-workflow.interfaces';
import { WorkflowsService } from './workflows.service';

describe('WorkflowsService', () => {
  let service: WorkflowsService;
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<WorkflowsService>(WorkflowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPagedWorkflows', () => {
    it('returns expected result', async () => {
      const monaiResult: PagedMonaiWorkflows = {
        totalPages: 1,
        totalRecords: 1,
        pageNumber: 1,
        pageSize: 10,
        firstPage: '/page-1',
        lastPage: '/page-1',
        nextPage: null,
        previousPage: null,
        data: [],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: monaiResult,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getPagedWorkflows(1, 10);

      expect(result).toMatchSnapshot();
    });
  });
});
