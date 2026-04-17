import { HttpStatus, Injectable } from '@nestjs/common';
import type {
  BackofficeAccessBootstrapRequest,
  BackofficeAccessBootstrapResponse,
  BackofficeAccessChannel,
  BackofficeAccessContextResponse,
  UserRole,
} from '@expressa/shared-types';
import {
  BACKOFFICE_ROLES,
  resolveAvailableTabs,
} from '../../domain/policies/backoffice-access.policy';
import { BackofficeSessionStorePort } from '../../domain/ports/backoffice-session-store.port';
import type { UserRecord } from '../../domain/models/user-record';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { AccessEnvironmentService } from '../../infrastructure/config/access-environment.service';
import { TelegramWebAppValidatorService } from '../../infrastructure/adapters/telegram-webapp-validator.service';
import { BackofficeAccessError } from '../errors/backoffice-access.error';

@Injectable()
export class BackofficeAccessService {
  constructor(
    private readonly environmentService: AccessEnvironmentService,
    private readonly sessionStore: BackofficeSessionStorePort,
    private readonly telegramValidator: TelegramWebAppValidatorService,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async bootstrapAccess(
    request: BackofficeAccessBootstrapRequest,
  ): Promise<BackofficeAccessBootstrapResponse> {
    const identity = this.resolveIdentity(request);
    const user = await this.userRepository.findByTelegramId(identity.telegramId);

    if (!user) {
      throw new BackofficeAccessError('user-not-found', HttpStatus.FORBIDDEN, 'User is not registered');
    }

    const roles = this.resolveBackofficeRoles(user.roles);
    this.assertActiveBackofficeUser(user, roles);

    const session = await this.sessionStore.createSession({
      userId: user.id,
      channel: identity.channel,
      isTestMode: identity.isTestMode,
    });

    return this.buildAccessContext(user, roles, session);
  }

  async getCurrentAccess(accessToken: string): Promise<BackofficeAccessContextResponse> {
    const session = await this.sessionStore.getSession(accessToken);

    if (!session) {
      throw new BackofficeAccessError(
        'access-token-invalid',
        HttpStatus.UNAUTHORIZED,
        'Access token is invalid',
      );
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      throw new BackofficeAccessError(
        'access-token-invalid',
        HttpStatus.UNAUTHORIZED,
        'Session user no longer exists',
      );
    }

    const roles = this.resolveBackofficeRoles(user.roles);
    this.assertActiveBackofficeUser(user, roles);

    return this.buildAccessContext(user, roles, session);
  }

  private buildAccessContext(
    user: UserRecord,
    roles: UserRole[],
    session: {
      token: string;
      channel: BackofficeAccessChannel;
      isTestMode: boolean;
    },
  ): BackofficeAccessContextResponse {
    return {
      accessToken: session.token,
      channel: session.channel,
      isTestMode: session.isTestMode,
      availableTabs: resolveAvailableTabs(roles),
      user: {
        userId: user.id,
        telegramId: user.telegramId,
        roles,
        blocked: user.blocked,
        isPrimaryAdministrator: user.isPrimaryAdministrator,
      },
    };
  }

  private resolveBackofficeRoles(roles: UserRole[]): UserRole[] {
    return roles.filter((role) => BACKOFFICE_ROLES.includes(role));
  }

  private assertActiveBackofficeUser(user: UserRecord, roles: UserRole[]): void {
    if (user.blocked) {
      throw new BackofficeAccessError('user-blocked', HttpStatus.FORBIDDEN, 'User is blocked');
    }

    if (roles.length === 0) {
      throw new BackofficeAccessError(
        'backoffice-role-required',
        HttpStatus.FORBIDDEN,
        'Backoffice role is required',
      );
    }
  }

  private resolveIdentity(request: BackofficeAccessBootstrapRequest): {
    telegramId: string;
    channel: BackofficeAccessChannel;
    isTestMode: boolean;
  } {
    if (request.mode === 'telegram') {
      if (!request.telegramInitData) {
        throw new BackofficeAccessError(
          'telegram-context-required',
          HttpStatus.UNAUTHORIZED,
          'Telegram context is required',
        );
      }

      const botToken = this.environmentService.backofficeBotToken;

      if (!botToken) {
        throw new BackofficeAccessError(
          'telegram-context-required',
          HttpStatus.UNAUTHORIZED,
          'Telegram authentication is disabled or not configured',
        );
      }

      return {
        telegramId: this.telegramValidator.validate(request.telegramInitData, botToken).telegramId,
        channel: 'backoffice-telegram-entry',
        isTestMode: false,
      };
    }

    if (!this.environmentService.disableTelegramAuth) {
      throw new BackofficeAccessError(
        'test-mode-disabled',
        HttpStatus.FORBIDDEN,
        'Test mode is disabled',
      );
    }

    if (!request.testTelegramId) {
      throw new BackofficeAccessError(
        'test-telegram-id-required',
        HttpStatus.BAD_REQUEST,
        'testTelegramId is required in test mode',
      );
    }

    return {
      telegramId: request.testTelegramId,
      channel: 'test-mode-without-telegram',
      isTestMode: true,
    };
  }
}
