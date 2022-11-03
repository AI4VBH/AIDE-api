import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from '../../../test/utilities/test-make-observable';
import { PagedClinicalReviews } from './clinical-review.interfaces';
import { ClinicalReviewService } from './clinical-review.service';

describe('WorkflowsService', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let configService: DeepMocked<ConfigService>;

  let service: ClinicalReviewService;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });
    configService = createMock<ConfigService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalReviewService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<ClinicalReviewService>(ClinicalReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClinicalReviews', () => {
    it('returns expected result', async () => {
      const monaiResult: PagedClinicalReviews = {
        totalPages: 1,
        totalRecords: 0,
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

      const result = await service.getClinicalReviews(1, 10, ['admin']);

      expect(result).toMatchSnapshot();
    });
  });
});