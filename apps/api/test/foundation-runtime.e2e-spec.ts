import request from 'supertest';

import { createApiApp } from '../src/app/create-app';
import { getApiRuntimeEnv } from '../src/shared/config/runtime-env';

describe('Foundation runtime smoke', () => {
  it('returns health payload and CORS header for the configured origin', async () => {
    const runtimeEnv = getApiRuntimeEnv({
      API_PORT: '3100',
      API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
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
