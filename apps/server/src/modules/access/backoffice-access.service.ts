import { HttpStatus, Injectable } from '@nestjs/common';
import type {
  BackofficeAccessBootstrapResponse,
  BackofficeAccessChannel,
  BackofficeTab,
  UserRole,
} from '@expressa/shared-types';
import { ADMINISTRATOR_ROLE, BACKOFFICE_ROLES, BACKOFFICE_TABS_BY_ROLE } from './access.constants';
import { BackofficeSessionService } from './backoffice-session.service';
import { BackofficeAccessBootstrapRequestDto } from './dto/backoffice-access-bootstrap-request.dto';
import { EnvironmentService } from './environment.service';
import { BackofficeAccessException } from './errors/backoffice-access.exception';
import { TelegramWebAppValidatorService } from './telegram-webapp-validator.service';
import { UserRepositoryPort } from './user-repository';

@Injectable()
export class BackofficeAccessService {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly sessionService: BackofficeSessionService,
    private readonly telegramValidator: TelegramWebAppValidatorService,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async bootstrapAccess(
    request: BackofficeAccessBootstrapRequestDto,
  ): Promise<BackofficeAccessBootstrapResponse> {
    const identity = this.resolveIdentity(request);
    const user = await this.userRepository.findByTelegramId(identity.telegramId);

    if (!user) {
      throw new BackofficeAccessException('user-not-found', HttpStatus.FORBIDDEN, 'User is not registered');
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

    const session = this.sessionService.createSession({
      userId: user.id,
      channel: identity.channel,
      isTestMode: identity.channel === 'test-mode-without-telegram',
    });

    return {
      accessToken: session.token,
      channel: identity.channel,
      isTestMode: session.isTestMode,
      availableTabs: this.resolveAvailableTabs(roles),
      user: {
        userId: user.id,
        telegramId: user.telegramId,
        roles,
        blocked: user.blocked,
        isPrimaryAdministrator: user.isPrimaryAdministrator,
      },
    };
  }

  resolveAvailableTabs(roles: UserRole[]): BackofficeTab[] {
    if (roles.includes(ADMINISTRATOR_ROLE)) {
      return [...BACKOFFICE_TABS_BY_ROLE.administrator];
    }

    return [...BACKOFFICE_TABS_BY_ROLE.barista];
  }

  private resolveIdentity(request: BackofficeAccessBootstrapRequestDto): {
    telegramId: string;
    channel: BackofficeAccessChannel;
  } {
    if (request.mode === 'telegram') {
      if (!request.telegramInitData) {
        throw new BackofficeAccessException(
          'telegram-context-required',
          HttpStatus.UNAUTHORIZED,
          'Telegram context is required',
        );
      }

      const botToken = this.environmentService.backofficeBotToken;

      if (!botToken) {
        throw new BackofficeAccessException(
          'telegram-context-required',
          HttpStatus.UNAUTHORIZED,
          'Telegram authentication is disabled or not configured',
        );
      }

      return {
        telegramId: this.telegramValidator.validate(request.telegramInitData, botToken).telegramId,
        channel: 'backoffice-telegram-entry',
      };
    }

    if (!this.environmentService.disableTelegramAuth) {
      throw new BackofficeAccessException(
        'test-mode-disabled',
        HttpStatus.FORBIDDEN,
        'Test mode is disabled',
      );
    }

    if (!request.testTelegramId) {
      throw new BackofficeAccessException(
        'test-telegram-id-required',
        HttpStatus.BAD_REQUEST,
        'testTelegramId is required in test mode',
      );
    }

    return {
      telegramId: request.testTelegramId,
      channel: 'test-mode-without-telegram',
    };
  }
}
