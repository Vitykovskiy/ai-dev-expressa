import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { ADMINISTRATOR_ROLE } from '../../domain/policies/backoffice-access.policy';
import { BackofficeAccessError } from '../../application/errors/backoffice-access.error';
import type { RequestWithBackofficeContext } from '../types/request-with-backoffice-context';

@Injectable()
export class AdministratorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithBackofficeContext>();
    const roles = request.backofficeContext?.user.roles ?? [];

    if (!roles.includes(ADMINISTRATOR_ROLE)) {
      throw new BackofficeAccessError(
        'administrator-role-required',
        HttpStatus.FORBIDDEN,
        'Administrator role is required',
      );
    }

    return true;
  }
}
