/*
 * Copyright 2022 Crown Copyright
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
