import { ConfigService } from '@nestjs/config';
import { BackofficeAccessService } from '../src/modules/access/application/services/backoffice-access.service';
import { InMemoryBackofficeSessionStore } from '../src/modules/access/infrastructure/persistence/in-memory-backoffice-session.store';
import { AccessEnvironmentService } from '../src/modules/access/infrastructure/config/access-environment.service';
import { InMemoryUserRepository } from '../src/modules/access/infrastructure/persistence/in-memory-user.repository';
import { TelegramWebAppValidatorService } from '../src/modules/access/infrastructure/adapters/telegram-webapp-validator.service';
import { createSignedTelegramInitData } from './helpers/telegram-init-data';

describe('BackofficeAccessService', () => {
  const createEnvironmentService = () => new AccessEnvironmentService(new ConfigService());

  const previousEnvironment = {
    ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
    DISABLE_TG_AUTH: process.env.DISABLE_TG_AUTH,
    TG_BACKOFFICE_BOT_TOKEN: process.env.TG_BACKOFFICE_BOT_TOKEN,
  };

  afterAll(() => {
    process.env.ADMIN_TELEGRAM_ID = previousEnvironment.ADMIN_TELEGRAM_ID;
    process.env.DISABLE_TG_AUTH = previousEnvironment.DISABLE_TG_AUTH;
    process.env.TG_BACKOFFICE_BOT_TOKEN = previousEnvironment.TG_BACKOFFICE_BOT_TOKEN;
  });

  it('returns administrator context for valid Telegram entry', async () => {
    process.env.ADMIN_TELEGRAM_ID = '710001';
    process.env.DISABLE_TG_AUTH = 'false';
    process.env.TG_BACKOFFICE_BOT_TOKEN = 'bot-token';

    const repository = new InMemoryUserRepository();
    await repository.save({
      id: 'user-1',
      telegramId: '710001',
      roles: ['administrator'],
      blocked: false,
      isPrimaryAdministrator: true,
    });

    const service = new BackofficeAccessService(
      createEnvironmentService(),
      new InMemoryBackofficeSessionStore(),
      new TelegramWebAppValidatorService(),
      repository,
    );

    const result = await service.bootstrapAccess({
      mode: 'telegram',
      telegramInitData: createSignedTelegramInitData('710001', 'bot-token'),
    });

    expect(result.channel).toBe('backoffice-telegram-entry');
    expect(result.availableTabs).toEqual(['orders', 'availability', 'menu', 'users', 'settings']);
    expect(result.user.roles).toEqual(['administrator']);
    expect(result.accessToken).toEqual(expect.any(String));
  });

  it('supports test mode when Telegram auth is disabled', async () => {
    process.env.ADMIN_TELEGRAM_ID = '720001';
    process.env.DISABLE_TG_AUTH = 'true';
    delete process.env.TG_BACKOFFICE_BOT_TOKEN;

    const repository = new InMemoryUserRepository();
    await repository.save({
      id: 'user-2',
      telegramId: '720001',
      roles: ['barista'],
      blocked: false,
      isPrimaryAdministrator: false,
    });

    const service = new BackofficeAccessService(
      createEnvironmentService(),
      new InMemoryBackofficeSessionStore(),
      new TelegramWebAppValidatorService(),
      repository,
    );

    const result = await service.bootstrapAccess({
      mode: 'test',
      testTelegramId: '720001',
    });

    expect(result.channel).toBe('test-mode-without-telegram');
    expect(result.isTestMode).toBe(true);
    expect(result.availableTabs).toEqual(['orders', 'availability']);
  });

  it('rejects test mode when DISABLE_TG_AUTH is false', async () => {
    process.env.ADMIN_TELEGRAM_ID = '730001';
    process.env.DISABLE_TG_AUTH = 'false';
    process.env.TG_BACKOFFICE_BOT_TOKEN = 'bot-token';

    const service = new BackofficeAccessService(
      createEnvironmentService(),
      new InMemoryBackofficeSessionStore(),
      new TelegramWebAppValidatorService(),
      new InMemoryUserRepository(),
    );

    await expect(
      service.bootstrapAccess({
        mode: 'test',
        testTelegramId: '730001',
      }),
    ).rejects.toThrow('Test mode is disabled');
  });

  it('rejects blocked users and users without backoffice role', async () => {
    process.env.ADMIN_TELEGRAM_ID = '740001';
    process.env.DISABLE_TG_AUTH = 'true';
    delete process.env.TG_BACKOFFICE_BOT_TOKEN;

    const repository = new InMemoryUserRepository();
    await repository.save({
      id: 'blocked-user',
      telegramId: '740001',
      roles: ['administrator'],
      blocked: true,
      isPrimaryAdministrator: false,
    });
    await repository.save({
      id: 'customer-user',
      telegramId: '740002',
      roles: ['customer'],
      blocked: false,
      isPrimaryAdministrator: false,
    });

    const service = new BackofficeAccessService(
      createEnvironmentService(),
      new InMemoryBackofficeSessionStore(),
      new TelegramWebAppValidatorService(),
      repository,
    );

    await expect(
      service.bootstrapAccess({
        mode: 'test',
        testTelegramId: '740001',
      }),
    ).rejects.toThrow('User is blocked');

    await expect(
      service.bootstrapAccess({
        mode: 'test',
        testTelegramId: '740002',
      }),
    ).rejects.toThrow('Backoffice role is required');
  });
});
