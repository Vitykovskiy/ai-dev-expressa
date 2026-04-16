import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import type { UserRecord } from '../src/modules/access/model/user-record';
import { UserRepositoryPort } from '../src/modules/access/user-repository';
import { createSignedTelegramInitData } from './helpers/telegram-init-data';

describe('Backoffice access HTTP flow', () => {
  let app: INestApplication;
  let userRepository: UserRepositoryPort;

  const previousEnvironment = {
    ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
    DISABLE_TG_AUTH: process.env.DISABLE_TG_AUTH,
    TG_BACKOFFICE_BOT_TOKEN: process.env.TG_BACKOFFICE_BOT_TOKEN,
  };

  beforeEach(async () => {
    process.env.ADMIN_TELEGRAM_ID = '750001';
    process.env.DISABLE_TG_AUTH = 'false';
    process.env.TG_BACKOFFICE_BOT_TOKEN = 'bot-token';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    userRepository = app.get(UserRepositoryPort);

    await seedUser({
      id: 'admin-user',
      telegramId: '750001',
      roles: ['administrator'],
      blocked: false,
      isPrimaryAdministrator: true,
    });
    await seedUser({
      id: 'barista-user',
      telegramId: '750002',
      roles: ['barista'],
      blocked: false,
      isPrimaryAdministrator: false,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(() => {
    process.env.ADMIN_TELEGRAM_ID = previousEnvironment.ADMIN_TELEGRAM_ID;
    process.env.DISABLE_TG_AUTH = previousEnvironment.DISABLE_TG_AUTH;
    process.env.TG_BACKOFFICE_BOT_TOKEN = previousEnvironment.TG_BACKOFFICE_BOT_TOKEN;
  });

  it('allows administrator bootstrap and protected administrator route', async () => {
    const bootstrapResponse = await request(app.getHttpServer())
      .post('/api/backoffice/access/bootstrap')
      .send({
        mode: 'telegram',
        telegramInitData: createSignedTelegramInitData('750001', 'bot-token'),
      })
      .expect(201);

    expect(bootstrapResponse.body.availableTabs).toEqual([
      'orders',
      'availability',
      'menu',
      'users',
      'settings',
    ]);

    await request(app.getHttpServer())
      .get('/api/backoffice/admin/ping')
      .set('Authorization', `Bearer ${bootstrapResponse.body.accessToken}`)
      .expect(200)
      .expect({
        status: 'ok',
        scope: 'administrator',
        telegramId: '750001',
      });
  });

  it('rejects direct working access without Telegram context', async () => {
    await request(app.getHttpServer())
      .post('/api/backoffice/access/bootstrap')
      .send({
        mode: 'telegram',
      })
      .expect(401)
      .expect({
        statusCode: 401,
        reason: 'telegram-context-required',
        message: 'Telegram context is required',
      });
  });

  it('rejects administrator scope for barista session', async () => {
    const bootstrapResponse = await request(app.getHttpServer())
      .post('/api/backoffice/access/bootstrap')
      .send({
        mode: 'telegram',
        telegramInitData: createSignedTelegramInitData('750002', 'bot-token'),
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/api/backoffice/admin/ping')
      .set('Authorization', `Bearer ${bootstrapResponse.body.accessToken}`)
      .expect(403);
  });

  async function seedUser(user: UserRecord): Promise<void> {
    await userRepository.save(user);
  }
});
