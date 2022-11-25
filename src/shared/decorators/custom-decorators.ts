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

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function decodeToken(request: any) {
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
