import { Injectable } from '@nestjs/common';
import { Model } from './models.interface';

@Injectable()
export class ModelsService {
  getModels(): Model {
    return {} as Model;
  }
}
