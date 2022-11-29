/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  realmRoles: UserRole[];
  enabled: boolean;

  public static formatUserDetails(
    userObject: UserRepresentation,
    userRoles: UserRole[],
  ) {
    const user = new User();
    user.id = userObject.id;
    user.firstName = userObject.firstName;
    user.lastName = userObject.lastName;
    user.email = userObject.email;
    user.realmRoles = userRoles;
    user.enabled = userObject.enabled;
    return user;
  }
}

export class UserRole {
  id: string;
  name: string;
}

export class UserPage {
  totalUserCount: number;
  totalFilteredUserCount: number;
  users: User[];
}
