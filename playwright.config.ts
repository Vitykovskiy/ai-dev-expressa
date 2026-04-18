import { defineConfig, devices } from '@playwright/test';
import {
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
} from './e2e/support/telegram-init-data';

const serverPort = 3000;
const backofficePort = 4173;
const deployedBaseUrl = process.env.E2E_BASE_URL?.trim();
const accessMode = resolveAccessMode(
  process.env.E2E_ACCESS_MODE?.trim().toLowerCase() ?? (deployedBaseUrl ? 'test' : 'telegram'),
);
const baseURL = deployedBaseUrl ?? `http://127.0.0.1:${backofficePort}`;
const useLocalWebServer = !deployedBaseUrl;

function resolveAccessMode(value: string): 'telegram' | 'test' {
  if (value === 'telegram' || value === 'test') {
    return value;
  }

  throw new Error(`Unsupported E2E_ACCESS_MODE: ${value}`);
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: useLocalWebServer
    ? [
        {
          command: 'npm run start:dev --workspace @expressa/server',
          url: `http://127.0.0.1:${serverPort}/api/backoffice/access/me`,
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          env: {
            ...process.env,
            PORT: String(serverPort),
            ADMIN_TELEGRAM_ID: FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
            DISABLE_TG_AUTH: accessMode === 'test' ? 'true' : 'false',
            TG_BACKOFFICE_BOT_TOKEN:
              accessMode === 'telegram' ? FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN : '',
          },
        },
        {
          command: `npm run dev --workspace @expressa/backoffice-web -- --host 127.0.0.1 --port ${backofficePort}`,
          url: `http://127.0.0.1:${backofficePort}`,
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          env: {
            ...process.env,
            VITE_APP_TITLE: 'Expressa Backoffice',
            VITE_API_BASE_URL: `http://127.0.0.1:${serverPort}`,
            VITE_DISABLE_TG_AUTH: accessMode === 'test' ? 'true' : 'false',
            VITE_TEST_TELEGRAM_ID:
              accessMode === 'test' ? FEATURE_001_E2E_ADMIN_TELEGRAM_ID : '',
          },
        },
      ]
    : undefined,
});
