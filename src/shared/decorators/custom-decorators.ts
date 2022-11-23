import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtBody } from './jwt-token.interface';

export function decodeToken(request: Request): JwtBody | null {
  const auth = request.headers['authorization'];

  if (!auth) {
    return null;
  }

  const tokenString: string = auth.split(' ')?.at(-1);

  if (!tokenString) {
    return null;
  }
  const base64Payload = tokenString.split('.')[1];
  const payloadBuffer = Buffer.from(base64Payload, 'base64');
  const updatedJwtPayload = JSON.parse(payloadBuffer.toString());

  return updatedJwtPayload;
}

export const Roles = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = decodeToken(request);

    if (!token) {
      return null;
    }

    const roles: string[] = token.realm_access.roles;

    return roles;
  },
);

export const UserId = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = decodeToken(request);

    if (!token) {
      return null;
    }

    const userId: string = token.preferred_username;

    return userId;
  },
);
