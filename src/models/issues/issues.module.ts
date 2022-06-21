import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
