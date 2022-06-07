import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationsService {
  getApplications(): string {
    return 'Hello World!';
  }
}
