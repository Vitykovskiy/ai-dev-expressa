import type {
  AccessChannel,
  AuthSessionBootstrapRequest,
  AuthSessionBootstrapResponse,
  AuthSessionUserSnapshot,
} from '@expressa/shared-types' with {
  "resolution-mode": "import"
};
import { Inject, Injectable } from '@nestjs/common';

import {
  API_RUNTIME_ENV,
  type ApiRuntimeEnv,
} from '../../shared/config/runtime-env';
import { IdentityAccessService } from '../identity-access/identity-access.service';
import type { IdentityUserRecord } from '../identity-access/identity-access.types';
import { TelegramInitDataValidator } from './telegram-init-data-validator';

function toUserSnapshot(user: IdentityUserRecord): AuthSessionUserSnapshot {
  return {
    displayName: user.displayName,
    roles: [...user.roles],
    telegramId: user.telegramId,
  };
}

function toBootstrapResponse(
  user: IdentityUserRecord,
  accessChannel: AccessChannel,
): AuthSessionBootstrapResponse {
  const userSnapshot = toUserSnapshot(user);

  if (user.blocked) {
    return {
      code: 'blocked-user',
      kind: 'blocked',
      user: userSnapshot,
    };
  }

  if (!user.roles.includes('administrator')) {
    return {
      code: 'administrator-role-required',
      kind: 'denied',
      user: userSnapshot,
    };
  }

  return {
    kind: 'authenticated',
    session: {
      ...userSnapshot,
      accessChannel,
      userId: user.userId,
    },
  };
}

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly identityAccessService: IdentityAccessService,
    private readonly telegramInitDataValidator: TelegramInitDataValidator,
    @Inject(API_RUNTIME_ENV)
    private readonly runtimeEnv: ApiRuntimeEnv,
  ) {}

  async bootstrapSession(
    request: AuthSessionBootstrapRequest,
  ): Promise<AuthSessionBootstrapResponse> {
    switch (request.mode) {
      case 'telegram-webapp':
        return this.bootstrapTelegramSession(request.initData);
      case 'test-mode':
        return this.bootstrapTestModeSession();
    }
  }

  private async bootstrapTelegramSession(
    initData: string,
  ): Promise<AuthSessionBootstrapResponse> {
    const telegramIdentity = this.telegramInitDataValidator.validate(initData);

    if (telegramIdentity === null) {
      return {
        code: 'telegram-entry-required',
        kind: 'denied',
        user: null,
      };
    }

    const user = await this.identityAccessService.syncTelegramIdentity(telegramIdentity);

    return toBootstrapResponse(user, 'backoffice-telegram-entry');
  }

  private async bootstrapTestModeSession(): Promise<AuthSessionBootstrapResponse> {
    if (!this.runtimeEnv.disableTelegramAuth) {
      return {
        code: 'test-mode-disabled',
        kind: 'denied',
        user: null,
      };
    }

    const user = await this.identityAccessService.bootstrapMainAdministrator();

    return toBootstrapResponse(user, 'test-mode-without-telegram');
  }
}
