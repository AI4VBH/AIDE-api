import { Injectable } from '@nestjs/common';
import { ApplicationDto } from './dto/applications.dto';

@Injectable()
export class ApplicationsService {
  getApplications(): ApplicationDto {
    return new ApplicationDto();
  }
}
