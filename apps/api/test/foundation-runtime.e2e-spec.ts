import request from 'supertest';

import { createApiApp } from '../src/app/create-app';
import { getApiRuntimeEnv } from '../src/shared/config/runtime-env';

describe('Foundation runtime smoke', () => {
  it('returns health payload and CORS header for the configured origin', async () => {
    const runtimeEnv = getApiRuntimeEnv({
      ADMIN_TELEGRAM_ID: '1001',
      API_PORT: '3100',
      API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
      DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
      DISABLE_TG_AUTH: 'false',
      TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
    });
    const app = await createApiApp({
      logger: [],
      runtimeEnv,
    });

    await app.init();

    await request(app.getHttpServer())
      .get('/api/foundation/health')
      .set('Origin', runtimeEnv.corsAllowedOrigin)
      .expect(200)
      .expect('access-control-allow-origin', runtimeEnv.corsAllowedOrigin)
      .expect({
        status: 'ok',
        service: 'api',
      });

    await app.close();
  });
});
