export interface ApplicationExceptionPayload {
  statusCode: number;
  message: string;
}

export class ApplicationException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly payload: ApplicationExceptionPayload,
  ) {
    super(payload.message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
