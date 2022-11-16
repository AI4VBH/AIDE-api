import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  realmRoles: UserRole[];
  enabled: boolean;
}

export class EditUserDto extends CreateUserDto {}

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
