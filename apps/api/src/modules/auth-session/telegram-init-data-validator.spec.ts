import { createHmac } from 'node:crypto';

import { TelegramInitDataValidator } from './telegram-init-data-validator';

const runtimeEnv = {
  adminTelegramId: '1001',
  backofficeBotToken: '123456:test-token',
  corsAllowedOrigin: 'http://localhost:5173',
  databaseUrl: 'postgresql://expressa:expressa@127.0.0.1:5432/expressa',
  disableTelegramAuth: false,
  port: 3100,
};

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

describe('TelegramInitDataValidator', () => {
  it('accepts valid Telegram init data and extracts the user identity', () => {
    const validator = new TelegramInitDataValidator(runtimeEnv);
    const initData = createSignedInitData(runtimeEnv.backofficeBotToken, {
      first_name: 'Main',
      id: 1001,
      last_name: 'Administrator',
    });

    expect(validator.validate(initData)).toEqual({
      displayName: 'Main Administrator',
      telegramId: '1001',
    });
  });

  it('rejects tampered Telegram init data', () => {
    const validator = new TelegramInitDataValidator(runtimeEnv);
    const validInitData = createSignedInitData(runtimeEnv.backofficeBotToken, {
      first_name: 'Barista',
      id: 2002,
    });
    const params = new URLSearchParams(validInitData);

    params.set(
      'user',
      JSON.stringify({
        first_name: 'Other',
        id: 2002,
      }),
    );

    expect(validator.validate(params.toString())).toBeNull();
  });
});
