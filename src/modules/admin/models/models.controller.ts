import { Controller, Get } from '@nestjs/common';
import { Model } from './models.interface';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly applicationsService: ModelsService) {}

  @Get()
  getModels(): Model[] {
    return this.applicationsService.getModels();
  }
}
