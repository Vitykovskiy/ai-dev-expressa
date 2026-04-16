import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { BACKOFFICE_ROLES } from './access.constants';
import { BackofficeAccessService } from './backoffice-access.service';
import { BackofficeSessionService } from './backoffice-session.service';
import { BackofficeAccessException } from './errors/backoffice-access.exception';
import type { ResolvedBackofficeContext } from './model/backoffice-session';
import { UserRepositoryPort } from './user-repository';

type RequestWithBackofficeContext = Request & {
  backofficeContext?: ResolvedBackofficeContext;
};

@Injectable()
export class BackofficeSessionGuard implements CanActivate {
  constructor(
    private readonly sessionService: BackofficeSessionService,
    private readonly accessService: BackofficeAccessService,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithBackofficeContext>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new BackofficeAccessException(
        'access-token-required',
        HttpStatus.UNAUTHORIZED,
        'Bearer token is required',
      );
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();
    const session = this.sessionService.getSession(token);

    if (!session) {
      throw new BackofficeAccessException(
        'access-token-invalid',
        HttpStatus.UNAUTHORIZED,
        'Access token is invalid',
      );
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      throw new BackofficeAccessException(
        'access-token-invalid',
        HttpStatus.UNAUTHORIZED,
        'Session user no longer exists',
      );
    }

    if (user.blocked) {
      throw new BackofficeAccessException('user-blocked', HttpStatus.FORBIDDEN, 'User is blocked');
    }

    const roles = user.roles.filter((role) => BACKOFFICE_ROLES.includes(role));

    if (roles.length === 0) {
      throw new BackofficeAccessException(
        'backoffice-role-required',
        HttpStatus.FORBIDDEN,
        'Backoffice role is required',
      );
    }

    request.backofficeContext = {
      accessToken: token,
      channel: session.channel,
      isTestMode: session.isTestMode,
      availableTabs: this.accessService.resolveAvailableTabs(roles),
      user: {
        userId: user.id,
        telegramId: user.telegramId,
        roles,
        blocked: user.blocked,
        isPrimaryAdministrator: user.isPrimaryAdministrator,
      },
    };

    return true;
  }
}

