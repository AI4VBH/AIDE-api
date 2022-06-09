import { Injectable } from '@nestjs/common';
import { Application } from './application.interface';

@Injectable()
export class ApplicationsService {
  getApplications(): Application {
    return {} as Application;
  }
}
