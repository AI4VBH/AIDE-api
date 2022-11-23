export interface RealmAccess {
  roles: string[];
}

export interface Account {
  roles: string[];
}

export interface ResourceAccess {
  account: Account;
}

export interface JwtBody {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  acr: string;
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  scope: string;
  clientId: string;
  email_verified: boolean;
  clientHost: string;
  preferred_username: string;
  clientAddress: string;
}
