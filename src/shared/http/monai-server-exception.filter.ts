import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

@Catch(Error)
export default class MonaiServerExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (Object.keys(exception).includes('config')) {
      const { message, status } = (
        exception as AxiosError
      ).toJSON() as ResponseException;

      if (
        status === HttpStatus.REQUEST_TIMEOUT ||
        status >= HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An issue occurred with the MONAI service',
        });
      }

      if (
        status === HttpStatus.BAD_REQUEST ||
        status === HttpStatus.NOT_FOUND
      ) {
        return response
          .status(status)
          .json((exception as AxiosError).response.data);
      }

      return response.status(status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message,
      });
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}

type ResponseException = {
  status: number;
  message: string;
};
