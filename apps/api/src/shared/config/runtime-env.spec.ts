import { getApiRuntimeEnv } from './runtime-env';

describe('getApiRuntimeEnv', () => {
  it('parses port and normalizes origin', () => {
    expect(
      getApiRuntimeEnv({
        ADMIN_TELEGRAM_ID: '1001',
        API_PORT: '3100',
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173/',
        DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
        DISABLE_TG_AUTH: 'true',
        TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
      }),
    ).toEqual({
      adminTelegramId: '1001',
      backofficeBotToken: '123456:test-token',
      port: 3100,
      corsAllowedOrigin: 'http://localhost:5173',
      databaseUrl: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
      disableTelegramAuth: true,
    });
  });

  it('throws when port is missing', () => {
    expect(() =>
      getApiRuntimeEnv({
        ADMIN_TELEGRAM_ID: '1001',
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
        DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
        DISABLE_TG_AUTH: 'false',
        TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
      }),
    ).toThrow(
      'API_PORT is not configured. Set it in process env or apps/api/.env.local',
    );
  });

  it('throws when origin contains a path', () => {
    expect(() =>
      getApiRuntimeEnv({
        ADMIN_TELEGRAM_ID: '1001',
        API_PORT: '3100',
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173/api',
        DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
        DISABLE_TG_AUTH: 'false',
        TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
      }),
    ).toThrow(
      'API_CORS_ALLOWED_ORIGIN must be an absolute origin without path',
    );
  });

  it('throws when DISABLE_TG_AUTH is not a boolean string', () => {
    expect(() =>
      getApiRuntimeEnv({
        ADMIN_TELEGRAM_ID: '1001',
        API_PORT: '3100',
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
        DATABASE_URL: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
        DISABLE_TG_AUTH: 'yes',
        TG_BACKOFFICE_BOT_TOKEN: '123456:test-token',
      }),
    ).toThrow('DISABLE_TG_AUTH must be either "true" or "false"');
  });
});
