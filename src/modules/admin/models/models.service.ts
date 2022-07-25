import { Injectable } from '@nestjs/common';
import { ModelDTO } from './models.dto';

@Injectable()
export class ModelsService {
  getModels(): ModelDTO[] {
    return [
      {
        model_id: 1,
        model_name: '3D Fetal Body MRI',
      },
      {
        model_id: 2,
        model_name: '3D Fetal Brain MRI',
      },
      {
        model_id: 3,
        model_name: '3D Fetal Heart MRI',
      },
      {
        model_id: 4,
        model_name: 'Stroke Pathway',
      },
      {
        model_id: 5,
        model_name: 'Brainminer CT',
      },
      {
        model_id: 6,
        model_name: 'MR Spectroscopy',
      },
    ];
  }
}
