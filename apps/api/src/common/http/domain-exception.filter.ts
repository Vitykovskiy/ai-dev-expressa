import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

import { DomainError } from "../errors/domain-error";

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof DomainError) {
      response.status(exception.statusCode).json({
        error: exception.code,
        message: exception.message
      });
      return;
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    response.status(500).json({
      error: "internal-server-error",
      message: "Unexpected server error"
    });
  }
}

