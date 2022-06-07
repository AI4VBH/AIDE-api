import { Injectable } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory {
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: process.env.AUTHSERVERURL,
      realm: process.env.REALM,
      clientId: process.env.CLIENTID,
      secret: process.env.SECRET,
    };
  }
}
