import { Injectable, HttpModuleOptionsFactory, HttpModuleOptions, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
