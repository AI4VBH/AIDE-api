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
} from './clinical-review.interfaces';
import { ClinicalReviewService } from './clinical-review.service';

@Controller('clinical-review')
@UseFilters(ExternalServerExceptionFilter)
export class ClinicalReviewController {
  @Inject(ClinicalReviewService)
  private readonly service: ClinicalReviewService;

  @Get()
  getClinicalReviews(
    @Roles() roles,
    @Query('pageNumber', ParseIntPipe) pageNumber = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('pageNumber or pageSize is invalid');
    }

    if (!roles) {
      throw new BadRequestException('roles are required');
    }

    return this.service.getClinicalReviews(pageNumber, pageSize, roles);
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
  GetDicomFile(@Query('key') key: string) {
    return this.service.getDicomFile(key);
  }

  @Get(':taskExecutionId')
  GetClinicalReviewTaskDetails(
    @Roles() roles,
    @Param('taskExecutionId') taskExecutionId: string,
  ): Promise<ClinicalReviewTaskDetails> {
    if (!roles) {
      throw new BadRequestException('roles are required');
    }

    return this.service.getClinicalReviewTaskDetails(roles, taskExecutionId);
  }
}
