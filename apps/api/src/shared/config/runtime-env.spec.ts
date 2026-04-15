import { getApiRuntimeEnv } from './runtime-env';

describe('getApiRuntimeEnv', () => {
  it('parses port and normalizes origin', () => {
    expect(
      getApiRuntimeEnv({
        API_PORT: '3100',
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173/',
      }),
    ).toEqual({
      port: 3100,
      corsAllowedOrigin: 'http://localhost:5173',
    });
  });

  it('throws when port is missing', () => {
    expect(() =>
      getApiRuntimeEnv({
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173',
      }),
    ).toThrow(
      'API_PORT is not configured. Set it in process env or apps/api/.env.local',
    );
  });

  it('throws when origin contains a path', () => {
    expect(() =>
      getApiRuntimeEnv({
        API_PORT: '3100',
        API_CORS_ALLOWED_ORIGIN: 'http://localhost:5173/api',
      }),
    ).toThrow(
      'API_CORS_ALLOWED_ORIGIN must be an absolute origin without path',
    );
  });
});
