import { Module } from '@nestjs/common';
import { ElasticModule } from '../../shared/elastic/elastic.module';
import { ExecutionsController } from './executions/executions.controller';
import { ExecutionsService } from './executions/executions.service';

@Module({
  imports: [ElasticModule],
  controllers: [ExecutionsController],
  providers: [ExecutionsService],
})
export class ClinicalReviewModule {}
