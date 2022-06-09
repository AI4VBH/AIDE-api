import { Controller, Get } from '@nestjs/common';
import { Application } from './application.interface';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  getApplications(): Application {
    return this.applicationsService.getApplications();
  }
}
