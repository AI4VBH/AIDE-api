import { HttpStatus } from "@nestjs/common/enums";

export class HttpError extends Error {
    constructor(statusCode: HttpStatus, message: string) {
      super(message);
  
      this.statusCode = statusCode;
    }
  
  readonly statusCode: HttpStatus;
  }
  
  