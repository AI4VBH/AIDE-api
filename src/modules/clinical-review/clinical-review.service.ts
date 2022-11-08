import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  ClinicalReviewAcknowledge,
  PagedClinicalReviews,
} from './clinical-review.interfaces';

@Injectable()
export class ClinicalReviewService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async getClinicalReviews(
    pageNumber: number,
    pageSize: number,
    roles: string[],
  ) {
    const params = new URLSearchParams({
      pageSize: `${pageSize || ''}`,
      pageNumber: `${pageNumber || ''}`,
      roles: `${roles.join(',') || ''}`,
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
}
