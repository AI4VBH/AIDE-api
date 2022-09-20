import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";

type ResponseException = {
    status: number;
    message: string;
};

@Catch(Error)
export default class MonaiServerExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const { status, message } = exception as unknown as ResponseException;

        if (status) {
            return response.status(status).json({
                statusCode: status,
                message
            });
        }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
}