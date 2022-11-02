import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'shared/decorators/custom-decorators';
import ExternalServerExceptionFilter from 'shared/http/external-server-exception.filter';
import { ClinicalReviewService } from './clinical-review.service';

@Controller('clinical-review')
@UseFilters(ExternalServerExceptionFilter)
export class ClinicalReviewController {
  @Inject(ClinicalReviewService)
  private readonly service: ClinicalReviewService;

  @Get()
  getClinicalReviews(
    @Roles('roles') roles,
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
}
