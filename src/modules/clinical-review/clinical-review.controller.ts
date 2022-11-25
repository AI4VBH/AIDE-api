import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles, UserId } from 'shared/decorators/custom-decorators';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import {
  ClinicalReviewAcknowledge,
  ClinicalReviewTaskDetails,
  PagedClinicalReviews,
} from './clinical-review.interfaces';
import { ClinicalReviewService } from './clinical-review.service';
import { IClinicalReviewRequest } from './IClinicalReviewRequest';

@Controller('clinical-review')
@UseFilters(ExternalServerExceptionFilter)
export class ClinicalReviewController {
  @Inject(ClinicalReviewService)
  private readonly service: ClinicalReviewService;

  @Get()
  getClinicalReviews(
    @Roles() roles: string[],
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('patientId') patientId = '',
    @Query('patientName') patientName = '',
    @Query('applicationName') applicationName = '',
  ): Promise<PagedClinicalReviews> {
    const req: IClinicalReviewRequest = {
      pageNumber,
      pageSize,
      applicationName,
      patientId,
      patientName,
      roles,
    };

    if (req.pageNumber <= 0 || req.pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    if (!req.roles) {
      throw new BadRequestException('roles are required');
    }

    return this.service.getClinicalReviews(req);
  }

  @Put(':clinicalReviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  acknowledgeClinicalReview(
    @Param('clinicalReviewId') clinicalReviewId: string,
    @Body() clinicalReview: ClinicalReviewAcknowledge,
    @Roles() roles,
    @UserId() userId,
  ) {
    if (!roles || !userId) {
      throw new BadRequestException('roles and userId are required');
    }

    return this.service.acknowledgeClinicalReview(
      clinicalReview,
      roles,
      userId,
      clinicalReviewId,
    );
  }

  @Get('dicom')
  getDicomFile(@Roles() roles, @Query('key') key: string) {
    if (!roles) {
      throw new BadRequestException('roles are required');
    }
    return this.service.getDicomFile(roles, key);
  }

  @Get(':taskExecutionId')
  getClinicalReviewTaskDetails(
    @Roles() roles,
    @Param('taskExecutionId') taskExecutionId: string,
  ): Promise<ClinicalReviewTaskDetails> {
    if (!roles) {
      throw new BadRequestException('roles are required');
    }

    return this.service.getClinicalReviewTaskDetails(roles, taskExecutionId);
  }
}
