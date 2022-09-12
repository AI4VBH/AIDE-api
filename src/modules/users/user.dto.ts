import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

export class User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  realmRoles: UserRole[];
  enabled: boolean;

  public static formatUserDetails(
    userObject: UserRepresentation,
    userRoles: UserRole[],
  ) {
    const user = new User();
    user.id = userObject.id;
    user.first_name = userObject.firstName;
    user.last_name = userObject.lastName;
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
