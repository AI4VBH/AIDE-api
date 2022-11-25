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

import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakAdminService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.adminClient = new KeycloakAdminClient({
      baseUrl: this.config.get<string>('KEYCLOAK_URL'),
      realmName: this.config.get<string>('KEYCLOAK_MASTER_REALM'),
    });
  }

  public readonly adminClient: KeycloakAdminClient;

  async performAction<T>(
    action: (realm: string, client: KeycloakAdminClient) => Promise<T>,
  ): Promise<T> {
    await this.adminClient.auth({
      grantType: 'client_credentials',
      clientId: this.config.get<string>('KEYCLOAK_CLIENTID'),
      clientSecret: this.config.get<string>('KEYCLOAK_SECRET'),
    });

    return await action(
      this.config.get<string>('KEYCLOAK_REALM'),
      this.adminClient,
    );
  }
}
