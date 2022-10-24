import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.config.get<string>('KEYCLOAK_URL'),
      realm: this.config.get<string>('KEYCLOAK_REALM'),
      clientId: this.config.get<string>('KEYCLOAK_CLIENTID'),
      secret: this.config.get<string>('KEYCLOAK_SECRET'),
      tokenValidation: TokenValidation.OFFLINE,
    };
  }
}
