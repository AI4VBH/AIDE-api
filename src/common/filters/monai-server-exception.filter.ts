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

      if (status === 408 || status >= 500) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An issue occurred with the MONAI service',
        });
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
