import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import internal from 'stream';
import {
  ClinicalReviewAcknowledge,
  PagedClinicalReviews,
  ClinicalReviewTaskDetails,
} from './clinical-review.interfaces';
import { IClinicalReviewRequest } from './IClinicalReviewRequest';

@Injectable()
export class ClinicalReviewService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async getClinicalReviews({
    pageNumber,
    pageSize,
    roles,
    patientId,
    patientName,
    applicationName,
  }: IClinicalReviewRequest) {
    const params = new URLSearchParams({
      pageSize: `${pageSize || ''}`,
      pageNumber: `${pageNumber || ''}`,
      roles: `${roles.join(',') || ''}`,
      patientId,
      patientName,
      applicationName,
    });

    const baseURL = this.configService.get<string>(
      'CLINICAL_REVIEW_SERVICE_HOST',
    );

    const getClinicalReviews = await firstValueFrom(
      this.httpService.get<PagedClinicalReviews>(`/clinical-review?${params}`, {
        baseURL,
      }),
    );

    return getClinicalReviews.data;
  }

  async acknowledgeClinicalReview(
    clinicalReview: ClinicalReviewAcknowledge,
    roles: string[],
    userId: string,
    clinicalReviewId: string,
  ) {
    clinicalReview.roles = roles;
    clinicalReview.userId = userId;

    const baseURL = this.configService.get<string>(
      'CLINICAL_REVIEW_SERVICE_HOST',
    );

    const acknowledgeClinicalReview = await firstValueFrom(
      this.httpService.put(
        `/clinical-review/${clinicalReviewId}`,
        clinicalReview,
        {
          baseURL,
        },
      ),
    );

    return acknowledgeClinicalReview.data;
  }

  async getClinicalReviewTaskDetails(
    roles: string[],
    clinicalReviewTaskId: string,
  ) {
    const params = new URLSearchParams({
      roles: `${roles.join(',') || ''}`,
    });

    const baseURL = this.configService.get<string>(
      'CLINICAL_REVIEW_SERVICE_HOST',
    );

    const getClinicalReviewTaskDetails = await firstValueFrom(
      this.httpService.get<ClinicalReviewTaskDetails>(
        `/task-details/${clinicalReviewTaskId}?${params}`,
        {
          baseURL,
        },
      ),
    );

    return getClinicalReviewTaskDetails.data;
  }

  async getDicomFile(
    roles: string[],
    key: string,
  ): Promise<{ stream: internal.Readable }> {
    const params = new URLSearchParams({
      roles: `${roles.join(',') || ''}`,
      key: `${key}`,
    });
    const baseURL = this.configService.get<string>(
      'CLINICAL_REVIEW_SERVICE_HOST',
    );

    const getDicomFile = await firstValueFrom(
      this.httpService.get(`/dicom?${params}`, {
        baseURL,
      }),
    );

    return getDicomFile.data;
  }
}
