import type {
  AuthSessionBootstrapResponse,
} from '@expressa/shared-types' with {
  "resolution-mode": "import"
};

import type { SyncTelegramIdentityInput } from '../identity-access/identity-access.service';
import { AuthSessionService } from './auth-session.service';
import type { TelegramIdentity } from './telegram-init-data-validator';

const runtimeEnv = {
  adminTelegramId: '1001',
  backofficeBotToken: '123456:test-token',
  corsAllowedOrigin: 'http://localhost:5173',
  databaseUrl: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
  disableTelegramAuth: true,
  port: 3100,
};

interface ServiceDependencies {
  bootstrapMainAdministrator?: jest.Mock<
    Promise<{
      blocked: boolean;
      displayName: string;
      roles: ('administrator' | 'barista' | 'customer')[];
      telegramId: string;
      userId: string;
    }>,
    []
  >;
  disableTelegramAuth?: boolean;
  syncTelegramIdentity?: jest.Mock<
    Promise<{
      blocked: boolean;
      displayName: string;
      roles: ('administrator' | 'barista' | 'customer')[];
      telegramId: string;
      userId: string;
    }>,
    [SyncTelegramIdentityInput]
  >;
  validate?: jest.Mock<TelegramIdentity | null, [string]>;
}

function createService(dependencies: ServiceDependencies = {}) {
  const identityAccessService = {
    bootstrapMainAdministrator:
      dependencies.bootstrapMainAdministrator
      ?? jest.fn().mockResolvedValue({
        blocked: false,
        displayName: 'Main Administrator',
        roles: ['administrator'],
        telegramId: '1001',
        userId: 'user-1',
      }),
    syncTelegramIdentity:
      dependencies.syncTelegramIdentity
      ?? jest.fn().mockResolvedValue({
        blocked: false,
        displayName: 'Main Administrator',
        roles: ['administrator'],
        telegramId: '1001',
        userId: 'user-1',
      }),
  };
  const validator = {
    validate: dependencies.validate ?? jest.fn().mockReturnValue({
      displayName: 'Main Administrator',
      telegramId: '1001',
    }),
  };
  const service = new AuthSessionService(
    identityAccessService as never,
    validator as never,
    {
      ...runtimeEnv,
      disableTelegramAuth:
        dependencies.disableTelegramAuth ?? runtimeEnv.disableTelegramAuth,
    },
  );

  return {
    identityAccessService,
    service,
    validator,
  };
}

describe('AuthSessionService', () => {
  it('bootstraps the main administrator in test mode when Telegram auth is disabled', async () => {
    const { identityAccessService, service } = createService();

    await expect(
      service.bootstrapSession({ mode: 'test-mode' }),
    ).resolves.toEqual<AuthSessionBootstrapResponse>({
      kind: 'authenticated',
      session: {
        accessChannel: 'test-mode-without-telegram',
        displayName: 'Main Administrator',
        roles: ['administrator'],
        telegramId: '1001',
        userId: 'user-1',
      },
    });

    expect(identityAccessService.bootstrapMainAdministrator).toHaveBeenCalledTimes(1);
  });

  it('denies test mode when Telegram auth is still required', async () => {
    const { identityAccessService, service } = createService({
      disableTelegramAuth: false,
    });

    await expect(
      service.bootstrapSession({ mode: 'test-mode' }),
    ).resolves.toEqual<AuthSessionBootstrapResponse>({
      code: 'test-mode-disabled',
      kind: 'denied',
      user: null,
    });

    expect(identityAccessService.bootstrapMainAdministrator).not.toHaveBeenCalled();
  });

  it('rejects Telegram bootstrap when init data is invalid', async () => {
    const { identityAccessService, service, validator } = createService({
      validate: jest.fn().mockReturnValue(null),
    });

    await expect(
      service.bootstrapSession({
        initData: 'query_id=demo',
        mode: 'telegram-webapp',
      }),
    ).resolves.toEqual<AuthSessionBootstrapResponse>({
      code: 'telegram-entry-required',
      kind: 'denied',
      user: null,
    });

    expect(validator.validate).toHaveBeenCalledWith('query_id=demo');
    expect(identityAccessService.syncTelegramIdentity).not.toHaveBeenCalled();
  });

  it('returns a denied branch for Telegram users without administrator role', async () => {
    const { service } = createService({
      syncTelegramIdentity: jest.fn().mockResolvedValue({
        blocked: false,
        displayName: 'Barista User',
        roles: ['barista'],
        telegramId: '2002',
        userId: 'user-2',
      }),
      validate: jest.fn().mockReturnValue({
        displayName: 'Barista User',
        telegramId: '2002',
      }),
    });

    await expect(
      service.bootstrapSession({
        initData: 'query_id=demo',
        mode: 'telegram-webapp',
      }),
    ).resolves.toEqual<AuthSessionBootstrapResponse>({
      code: 'administrator-role-required',
      kind: 'denied',
      user: {
        displayName: 'Barista User',
        roles: ['barista'],
        telegramId: '2002',
      },
    });
  });

  it('returns a blocked branch for blocked administrators', async () => {
    const { service } = createService({
      syncTelegramIdentity: jest.fn().mockResolvedValue({
        blocked: true,
        displayName: 'Blocked Administrator',
        roles: ['administrator'],
        telegramId: '3003',
        userId: 'user-3',
      }),
      validate: jest.fn().mockReturnValue({
        displayName: 'Blocked Administrator',
        telegramId: '3003',
      }),
    });

    await expect(
      service.bootstrapSession({
        initData: 'query_id=demo',
        mode: 'telegram-webapp',
      }),
    ).resolves.toEqual<AuthSessionBootstrapResponse>({
      code: 'blocked-user',
      kind: 'blocked',
      user: {
        displayName: 'Blocked Administrator',
        roles: ['administrator'],
        telegramId: '3003',
      },
    });
  });
});
