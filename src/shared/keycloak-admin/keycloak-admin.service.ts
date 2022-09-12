import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakAdminService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.adminClient = new KeycloakAdminClient({
      baseUrl: this.config.get<string>('KEYCLOAK_URL'),
      realmName: this.config.get<string>('KEYCLOAK_MAIN_REALM'),
    });
  }

  adminClient: KeycloakAdminClient;

  async setupKeycloakAdmin() {
    await this.adminClient.auth({
      grantType: 'client_credentials',
      clientId: this.config.get<string>('KEYCLOAK_CLIENTID'),
      clientSecret: this.config.get<string>('KEYCLOAK_SECRET'),
    });
  }
}
