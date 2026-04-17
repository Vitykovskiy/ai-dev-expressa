import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { ApplicationException } from '../errors/application.exception';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter<ApplicationException> {
  catch(exception: ApplicationException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(exception.statusCode).json(exception.payload);
  }
}
