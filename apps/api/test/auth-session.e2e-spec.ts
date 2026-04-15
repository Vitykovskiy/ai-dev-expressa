import { createHmac } from 'node:crypto';

import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app/app.module';
import { IDENTITY_ACCESS_REPOSITORY } from '../src/modules/identity-access/identity-access.types';
import { getApiRuntimeEnv } from '../src/shared/config/runtime-env';

interface StoredUser {
  blocked: boolean;
  displayName: string;
  roles: ('administrator' | 'barista' | 'customer')[];
  telegramId: string;
  userId: string;
}

class InMemoryIdentityAccessRepository {
  private readonly usersByTelegramId = new Map<string, StoredUser>();

  async upsertTelegramUser(input: {
    displayName: string;
    ensureAdministrator: boolean;
    telegramId: string;
  }): Promise<StoredUser> {
    const existingUser = this.usersByTelegramId.get(input.telegramId);

    if (existingUser === undefined) {
      const nextUser: StoredUser = {
        blocked: false,
        displayName: input.displayName,
        roles: input.ensureAdministrator ? ['administrator'] : [],
        telegramId: input.telegramId,
        userId: `user-${this.usersByTelegramId.size + 1}`,
      };

      this.usersByTelegramId.set(input.telegramId, nextUser);

      return nextUser;
    }

    const nextRoles: StoredUser['roles'] =
      input.ensureAdministrator && !existingUser.roles.includes('administrator')
        ? [...existingUser.roles, 'administrator']
        : existingUser.roles;
    const nextUser: StoredUser = {
      ...existingUser,
      displayName: input.displayName,
      roles: nextRoles,
    };

    this.usersByTelegramId.set(input.telegramId, nextUser);

    return nextUser;
  }

  size(): number {
    return this.usersByTelegramId.size;
  }
}

function createSignedInitData(
  botToken: string,
  userPayload: Record<string, unknown>,
): string {
  const params = new URLSearchParams();

  params.set('auth_date', '1713270417');
  params.set('query_id', 'AAEAAQ');
  params.set('user', JSON.stringify(userPayload));

  const dataCheckString = [...params.entries()]
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secret = createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const hash = createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  params.set('hash', hash);

  return params.toString();
}

describe('Auth session endpoint', () => {
  it('bootstraps the main administrator idempotently in test mode', async () => {
    const runtimeEnv = getApiRuntimeEnv({
      ADMIN_TELEGRAM_ID: '1001',
      API_PORT: '3100',
      API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
      DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
      DISABLE_TG_AUTH: 'true',
      TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
    });
    const repository = new InMemoryIdentityAccessRepository();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(runtimeEnv)],
    })
      .overrideProvider(IDENTITY_ACCESS_REPOSITORY)
      .useValue(repository)
      .compile();
    const app = moduleRef.createNestApplication();

    await app.init();

    const firstResponse = await request(app.getHttpServer())
      .post('/api/auth/session')
      .send({ mode: 'test-mode' })
      .expect(200);
    const secondResponse = await request(app.getHttpServer())
      .post('/api/auth/session')
      .send({ mode: 'test-mode' })
      .expect(200);

    expect(firstResponse.body).toEqual({
      kind: 'authenticated',
      session: {
        accessChannel: 'test-mode-without-telegram',
        displayName: 'Main Administrator',
        roles: ['administrator'],
        telegramId: '1001',
        userId: 'user-1',
      },
    });
    expect(secondResponse.body).toEqual(firstResponse.body);
    expect(repository.size()).toBe(1);

    await app.close();
  });

  it('returns the denied contract for Telegram users without administrator role', async () => {
    const runtimeEnv = getApiRuntimeEnv({
      ADMIN_TELEGRAM_ID: '1001',
      API_PORT: '3100',
      API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
      DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
      DISABLE_TG_AUTH: 'false',
      TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
    });
    const repository = new InMemoryIdentityAccessRepository();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(runtimeEnv)],
    })
      .overrideProvider(IDENTITY_ACCESS_REPOSITORY)
      .useValue(repository)
      .compile();
    const app = moduleRef.createNestApplication();
    const initData = createSignedInitData(runtimeEnv.backofficeBotToken, {
      first_name: 'Barista',
      id: 2002,
    });

    await app.init();

    const response = await request(app.getHttpServer())
      .post('/api/auth/session')
      .send({
        initData,
        mode: 'telegram-webapp',
      })
      .expect(403);

    expect(response.body).toEqual({
      code: 'administrator-role-required',
      kind: 'denied',
      user: {
        displayName: 'Barista',
        roles: [],
        telegramId: '2002',
      },
    });

    await app.close();
  });
});
