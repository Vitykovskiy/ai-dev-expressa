import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { BackofficeAccessError } from '../../application/errors/backoffice-access.error';
import { BackofficeAccessService } from '../../application/services/backoffice-access.service';
import type { RequestWithBackofficeContext } from '../types/request-with-backoffice-context';

@Injectable()
export class BackofficeSessionGuard implements CanActivate {
  constructor(private readonly accessService: BackofficeAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithBackofficeContext>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new BackofficeAccessError(
        'access-token-required',
        HttpStatus.UNAUTHORIZED,
        'Bearer token is required',
      );
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();
    request.backofficeContext = await this.accessService.getCurrentAccess(token);

    return true;
  }
}
