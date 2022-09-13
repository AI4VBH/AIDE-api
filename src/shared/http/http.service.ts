import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModuleOptionsFactory, HttpModuleOptions } from '@nestjs/axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
      baseURL: this.config.get<string>('MONAI_API_HOST'),
    };
  }
}
