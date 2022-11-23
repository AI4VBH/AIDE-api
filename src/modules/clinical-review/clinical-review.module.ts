import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpConfigService } from 'shared/http/http.service';
import { ClinicalReviewController } from './clinical-review.controller';
import { ClinicalReviewService } from './clinical-review.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  controllers: [ClinicalReviewController],
  providers: [ClinicalReviewService],
})
export class ClinicalReviewModule {}
