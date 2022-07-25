import { Controller, Get } from '@nestjs/common';
import { ModelDTO } from './models.dto';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly applicationsService: ModelsService) {}

  @Get()
  getModels(): ModelDTO[] {
    return this.applicationsService.getModels();
  }
}
