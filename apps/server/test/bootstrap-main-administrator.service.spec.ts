import { ConfigService } from '@nestjs/config';
import { BootstrapMainAdministratorService } from '../src/modules/access/application/services/bootstrap-main-administrator.service';
import { AccessEnvironmentService } from '../src/modules/access/infrastructure/config/access-environment.service';
import { InMemoryUserRepository } from '../src/modules/access/infrastructure/persistence/in-memory-user.repository';

describe('BootstrapMainAdministratorService', () => {
  const createEnvironmentService = () => new AccessEnvironmentService(new ConfigService());

  const previousEnvironment = {
    ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
    DISABLE_TG_AUTH: process.env.DISABLE_TG_AUTH,
    TG_BACKOFFICE_BOT_TOKEN: process.env.TG_BACKOFFICE_BOT_TOKEN,
  };

  beforeEach(() => {
    process.env.ADMIN_TELEGRAM_ID = '700001';
    process.env.DISABLE_TG_AUTH = 'true';
    delete process.env.TG_BACKOFFICE_BOT_TOKEN;
  });

  afterAll(() => {
    process.env.ADMIN_TELEGRAM_ID = previousEnvironment.ADMIN_TELEGRAM_ID;
    process.env.DISABLE_TG_AUTH = previousEnvironment.DISABLE_TG_AUTH;
    process.env.TG_BACKOFFICE_BOT_TOKEN = previousEnvironment.TG_BACKOFFICE_BOT_TOKEN;
  });

  it('creates main administrator on empty repository', async () => {
    const repository = new InMemoryUserRepository();
    const service = new BootstrapMainAdministratorService(createEnvironmentService(), repository);

    const user = await service.ensureMainAdministrator();

    expect(user.telegramId).toBe('700001');
    expect(user.roles).toEqual(['administrator']);
    expect(user.isPrimaryAdministrator).toBe(true);
  });

  it('keeps bootstrap idempotent across repeated runs', async () => {
    const repository = new InMemoryUserRepository();
    const service = new BootstrapMainAdministratorService(createEnvironmentService(), repository);

    await service.ensureMainAdministrator();
    await service.ensureMainAdministrator();

    const users = await repository.list();

    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      telegramId: '700001',
      isPrimaryAdministrator: true,
    });
  });

  it('upgrades existing user to primary administrator without duplicating record', async () => {
    const repository = new InMemoryUserRepository();

    await repository.save({
      id: 'existing-user',
      telegramId: '700001',
      roles: ['customer'],
      blocked: false,
      isPrimaryAdministrator: false,
    });

    const service = new BootstrapMainAdministratorService(createEnvironmentService(), repository);
    const user = await service.ensureMainAdministrator();

    expect(user.id).toBe('existing-user');
    expect(user.roles).toEqual(['customer', 'administrator']);
    expect(user.isPrimaryAdministrator).toBe(true);
  });
});

