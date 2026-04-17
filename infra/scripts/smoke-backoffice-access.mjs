import { createHmac } from 'node:crypto';

const defaultBaseUrl = 'http://127.0.0.1:3000';

const smokeMode = (process.env.SMOKE_MODE ?? 'working').trim().toLowerCase();
const smokeBaseUrl = readOptional('SMOKE_BASE_URL') ?? defaultBaseUrl;
const adminTelegramId = readRequired('SMOKE_ADMIN_TELEGRAM_ID', 'ADMIN_TELEGRAM_ID');
const testTelegramId = readOptional('SMOKE_TEST_TELEGRAM_ID') ?? adminTelegramId;
const backofficeBotToken =
  smokeMode === 'working'
    ? readRequired('SMOKE_TG_BACKOFFICE_BOT_TOKEN', 'TG_BACKOFFICE_BOT_TOKEN')
    : null;

const bootstrapUrl = new URL('/api/backoffice/access/bootstrap', smokeBaseUrl);
const administratorPingUrl = new URL('/api/backoffice/admin/ping', smokeBaseUrl);

async function main() {
  await waitForServerReadiness();

  if (smokeMode === 'test') {
    await assertTestModeAccess();
  } else if (smokeMode === 'working') {
    await assertWorkingAccess();
  } else {
    throw new Error(`Unsupported SMOKE_MODE: ${smokeMode}`);
  }

  await assertDirectWorkingAccessDenied();

  console.log(`Smoke-check passed for mode=${smokeMode} via ${smokeBaseUrl}`);
}

async function waitForServerReadiness() {
  const startedAt = Date.now();
  const deadline = startedAt + 30_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(bootstrapUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ mode: 'telegram' }),
      });

      if (response.status > 0) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await delay(1_000);
  }

  throw new Error(`Server readiness check failed: ${String(lastError ?? 'timeout')}`);
}

async function assertWorkingAccess() {
  const payload = {
    mode: 'telegram',
    telegramInitData: createSignedTelegramInitData(adminTelegramId, backofficeBotToken),
  };

  const bootstrapResponse = await postJson(bootstrapUrl, payload);
  expectStatus(bootstrapResponse, 201, 'Working bootstrap must return 201');

  const bootstrapBody = await bootstrapResponse.json();

  assertEqual(bootstrapBody.channel, 'backoffice-telegram-entry', 'Unexpected access channel');
  assertEqual(bootstrapBody.isTestMode, false, 'Working smoke-check must stay in working mode');
  assertIncludesAllTabs(
    bootstrapBody.availableTabs,
    ['menu', 'users', 'settings'],
    'Administrator tabs are incomplete after bootstrap',
  );

  const pingResponse = await fetch(administratorPingUrl, {
    headers: {
      authorization: `Bearer ${bootstrapBody.accessToken}`,
    },
  });

  expectStatus(pingResponse, 200, 'Administrator scope probe must return 200');

  const pingBody = await pingResponse.json();
  assertEqual(pingBody.scope, 'administrator', 'Administrator scope probe returned wrong scope');
  assertEqual(
    String(pingBody.telegramId),
    adminTelegramId,
    'Administrator scope probe returned wrong telegramId',
  );
}

async function assertTestModeAccess() {
  const bootstrapResponse = await postJson(bootstrapUrl, {
    mode: 'test',
    testTelegramId,
  });

  expectStatus(bootstrapResponse, 201, 'Test-mode bootstrap must return 201');

  const bootstrapBody = await bootstrapResponse.json();

  assertEqual(
    bootstrapBody.channel,
    'test-mode-without-telegram',
    'Unexpected channel for test-mode bootstrap',
  );
  assertEqual(bootstrapBody.isTestMode, true, 'Test-mode smoke-check must mark test mode');
  assertIncludesAllTabs(
    bootstrapBody.availableTabs,
    ['menu', 'users', 'settings'],
    'Administrator tabs are incomplete in test mode',
  );

  const pingResponse = await fetch(administratorPingUrl, {
    headers: {
      authorization: `Bearer ${bootstrapBody.accessToken}`,
    },
  });

  expectStatus(pingResponse, 200, 'Administrator scope probe must return 200 in test mode');
}

async function assertDirectWorkingAccessDenied() {
  const negativeResponse = await postJson(bootstrapUrl, {
    mode: 'telegram',
  });

  expectStatus(
    negativeResponse,
    401,
    'Direct working access without Telegram context must be rejected',
  );

  const negativeBody = await negativeResponse.json();
  assertEqual(
    negativeBody.reason,
    'telegram-context-required',
    'Unexpected denial reason for direct working access',
  );
}

async function postJson(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

function createSignedTelegramInitData(userId, botToken) {
  const params = new URLSearchParams({
    auth_date: '1713225600',
    query_id: 'feature001-smoke-check',
    user: JSON.stringify({
      id: Number(userId),
      first_name: 'Main',
      username: 'administrator',
    }),
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

function assertIncludesAllTabs(actualTabs, expectedTabs, message) {
  const actual = Array.isArray(actualTabs) ? actualTabs : [];

  for (const tab of expectedTabs) {
    if (!actual.includes(tab)) {
      throw new Error(`${message}: missing ${tab}`);
    }
  }
}

function expectStatus(response, expectedStatus, message) {
  if (response.status !== expectedStatus) {
    throw new Error(`${message}. Expected ${expectedStatus}, got ${response.status}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}`);
  }
}

function readRequired(...keys) {
  for (const key of keys) {
    const value = readOptional(key);

    if (value) {
      return value;
    }
  }

  throw new Error(`Missing required environment variable. Checked: ${keys.join(', ')}`);
}

function readOptional(key) {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
}

function delay(timeoutMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMs);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
