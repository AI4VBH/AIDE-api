export enum ExecutionsServiceExceptionType {
  MISSING_TASK = 1,
}

export class ExecutionsServiceException extends Error {
  constructor(type: ExecutionsServiceExceptionType, message: string) {
    super(message);

    this.type = type;
  }

  readonly type: ExecutionsServiceExceptionType;
}
