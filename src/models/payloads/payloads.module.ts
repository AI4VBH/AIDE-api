import { Module } from '@nestjs/common';
import { PayloadsController } from './payloads.controller';
import { PayloadsService } from './payloads.service';

@Module({
  controllers: [PayloadsController],
  providers: [PayloadsService],
})
export class PayloadsModule {}
