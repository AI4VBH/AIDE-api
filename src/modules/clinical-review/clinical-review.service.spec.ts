import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from '../../../test/utilities/test-make-observable';
import * as clinicalReviewInterfaces from './clinical-review.interfaces';
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
      const monaiResult: clinicalReviewInterfaces.PagedClinicalReviews = {
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

  describe('acknowledgeClinicalReview', () => {
    it('returns expected result', async () => {
      const review: clinicalReviewInterfaces.ClinicalReviewAcknowledge = {
        acceptance: true,
        task_id: 'taskid',
        reason: 'all good',
        message: 'message',
        execution_id: 'guid',
        roles: [],
        userId: '',
      };

      const clinicalReviewId = 'clinical-review-id';

      axios.put.mockResolvedValue({
        status: 201,
      });

      httpService.put.mockReturnValue(makeObservableForTest(axios.put));

      const result = await service.acknowledgeClinicalReview(
        review,
        ['admin'],
        'userid',
        clinicalReviewId,
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('getClinicalReviewTaskDetails', () => {
    it('returns expected result', async () => {
      const result: clinicalReviewInterfaces.ClinicalReviewTaskDetails = {
        execution_id: '12345',
        study: [
          {
            series_id: 'series-id',
            modality: 'CT',
            files: ['object-keys-for-minio'],
          },
          {
            series_id: 'another-series-id',
            modality: 'DOC',
            files: [
              'other-object-keys-for-minio',
              'another-object-keys-for-minio',
            ],
          },
        ],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: result,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const clinicalTaskReviewId = 'id-123';
      const roles = ['realm:clinician'];
      const taskDetailsReturned = await service.getClinicalReviewTaskDetails(
        roles,
        clinicalTaskReviewId,
      );

      expect(taskDetailsReturned).toMatchSnapshot();
    });
  });
});
