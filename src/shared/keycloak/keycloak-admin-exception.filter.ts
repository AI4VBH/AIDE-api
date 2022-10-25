import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';
import {
  RoleServiceException,
  RoleServiceExceptionCode,
} from 'modules/roles/roles.service';
import {
  UserServiceException,
  UserServiceExceptionCode,
} from 'modules/users/users.service';

type ResponseException = {
  message: string;
  status: number;
};

@Catch(Error)
export class KeycloakAdminExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof RoleServiceException) {
      this.handleRoleException(exception, response);

      return;
    }

    if (exception instanceof UserServiceException) {
      this.handleUserException(exception, response);

      return;
    }

    if (Object.keys(exception).includes('config')) {
      const { message, status } = (
        exception as AxiosError
      ).toJSON() as ResponseException;

      response.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message,
      });

      return;
    }

    const { message, status } = exception as unknown as ResponseException;

    if (status) {
      response.status(status).json({
        statusCode: status,
        message,
      });

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }

  private handleRoleException(
    exception: RoleServiceException,
    response: Response,
  ) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case RoleServiceExceptionCode.ROLE_NOT_FOUND:
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;

      case RoleServiceExceptionCode.ROLE_NOT_EDITABLE:
        status = HttpStatus.FORBIDDEN;
        message = exception.message;
        break;

      case RoleServiceExceptionCode.ROLE_DUPLICATE:
        status = HttpStatus.CONFLICT;
        message = exception.message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }

  private handleUserException(
    exception: UserServiceException,
    response: Response,
  ) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case UserServiceExceptionCode.USER_NOT_FOUND:
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
