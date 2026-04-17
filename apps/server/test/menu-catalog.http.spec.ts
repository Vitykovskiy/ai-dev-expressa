import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { UserRecord } from '../src/modules/access/domain/models/user-record';
import { UserRepositoryPort } from '../src/modules/access/domain/ports/user-repository.port';
import { AppModule } from '../src/app.module';
import { createSignedTelegramInitData } from './helpers/telegram-init-data';

describe('Menu catalog HTTP flow', () => {
  let app: INestApplication;
  let userRepository: UserRepositoryPort;

  const previousEnvironment = {
    ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
    DISABLE_TG_AUTH: process.env.DISABLE_TG_AUTH,
    TG_BACKOFFICE_BOT_TOKEN: process.env.TG_BACKOFFICE_BOT_TOKEN,
  };

  beforeEach(async () => {
    process.env.ADMIN_TELEGRAM_ID = '760001';
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
      telegramId: '760001',
      roles: ['administrator'],
      blocked: false,
      isPrimaryAdministrator: true,
    });
    await seedUser({
      id: 'barista-user',
      telegramId: '760002',
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

  it('returns the current catalog snapshot and allows administrator to save it', async () => {
    const adminToken = await bootstrapAccess('760001');

    await request(app.getHttpServer())
      .get('/api/backoffice/menu/catalog')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect({
        categories: [],
        items: [],
        optionGroups: [],
      });

    const catalogSnapshot = {
      categories: [
        {
          menuCategoryId: 'coffee',
          name: 'Кофе',
          optionGroupRefs: ['milk'],
        },
      ],
      items: [
        {
          menuItemId: 'flat-white',
          menuCategoryId: 'coffee',
          name: 'Флэт уайт',
          itemType: 'drink',
          basePrice: null,
          sizePrices: [
            { size: 'S', price: 180 },
            { size: 'M', price: 220 },
            { size: 'L', price: 260 },
          ],
        },
      ],
      optionGroups: [
        {
          optionGroupId: 'milk',
          name: 'Молоко',
          selectionMode: 'single',
          options: [
            {
              optionId: 'almond',
              name: 'Миндальное',
              priceDelta: 45,
            },
          ],
        },
      ],
    };

    await request(app.getHttpServer())
      .put('/api/backoffice/menu/catalog')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(catalogSnapshot)
      .expect(200)
      .expect(catalogSnapshot);

    await request(app.getHttpServer())
      .get('/api/backoffice/menu/catalog')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect(catalogSnapshot);
  });

  it('rejects barista access to the menu catalog API', async () => {
    const baristaToken = await bootstrapAccess('760002');

    await request(app.getHttpServer())
      .get('/api/backoffice/menu/catalog')
      .set('Authorization', `Bearer ${baristaToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        reason: 'administrator-role-required',
        message: 'Administrator role is required',
      });
  });

  it('returns a business error when drink size rules are violated', async () => {
    const adminToken = await bootstrapAccess('760001');

    await request(app.getHttpServer())
      .put('/api/backoffice/menu/catalog')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categories: [
          {
            menuCategoryId: 'tea',
            name: 'Чай',
            optionGroupRefs: [],
          },
        ],
        items: [
          {
            menuItemId: 'matcha',
            menuCategoryId: 'tea',
            name: 'Матча',
            itemType: 'drink',
            basePrice: null,
            sizePrices: [
              { size: 'S', price: 200 },
              { size: 'S', price: 240 },
              { size: 'L', price: 280 },
            ],
          },
        ],
        optionGroups: [],
      })
      .expect(422)
      .expect({
        statusCode: 422,
        reason: 'invalid-drink-size-model',
        message: 'Drink "matcha" must define prices for sizes S, M and L exactly once',
      });
  });

  async function bootstrapAccess(telegramId: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/backoffice/access/bootstrap')
      .send({
        mode: 'telegram',
        telegramInitData: createSignedTelegramInitData(telegramId, 'bot-token'),
      })
      .expect(201);

    return response.body.accessToken;
  }

  async function seedUser(user: UserRecord): Promise<void> {
    await userRepository.save(user);
  }
});
