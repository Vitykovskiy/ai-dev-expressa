import { createHmac } from 'node:crypto';

export const FEATURE_001_E2E_ADMIN_TELEGRAM_ID = '750001';
export const FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN = 'bot-token';

export function createSignedTelegramInitData(
  userId: string,
  botToken: string,
  extraEntries: Record<string, string> = {},
): string {
  const params = new URLSearchParams({
    auth_date: '1713225600',
    query_id: 'feature-001-e2e-query',
    user: JSON.stringify({
      id: Number(userId),
      first_name: 'Main',
      username: 'administrator',
    }),
    ...extraEntries,
  });

  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hash = createHmac('sha256', secret).update(dataCheckString).digest('hex');

  params.set('hash', hash);
  return params.toString();
}
