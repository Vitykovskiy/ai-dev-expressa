import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { ADMINISTRATOR_ROLE } from './access.constants';
import { BackofficeAccessException } from './errors/backoffice-access.exception';
import type { ResolvedBackofficeContext } from './model/backoffice-session';

type RequestWithBackofficeContext = Request & {
  backofficeContext?: ResolvedBackofficeContext;
};

@Injectable()
export class AdministratorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithBackofficeContext>();
    const roles = request.backofficeContext?.user.roles ?? [];

    if (!roles.includes(ADMINISTRATOR_ROLE)) {
      throw new BackofficeAccessException(
        'administrator-role-required',
        HttpStatus.FORBIDDEN,
        'Administrator role is required',
      );
    }

    return true;
  }
}

