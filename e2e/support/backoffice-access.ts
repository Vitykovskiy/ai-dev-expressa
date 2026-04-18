import type { Page } from '@playwright/test';
import { injectTelegramWebApp } from './backoffice-telegram-web-app';
import {
  createSignedTelegramInitData,
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
} from './telegram-init-data';

export type E2EAccessMode = 'telegram' | 'test';

const administratorTelegramInitData = createSignedTelegramInitData(
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
);

export function resolveE2EAccessMode(): E2EAccessMode {
  const configuredAccessMode = process.env.E2E_ACCESS_MODE?.trim().toLowerCase();

  if (!configuredAccessMode) {
    return process.env.E2E_BASE_URL ? 'test' : 'telegram';
  }

  if (configuredAccessMode === 'telegram' || configuredAccessMode === 'test') {
    return configuredAccessMode;
  }

  throw new Error(`Unsupported E2E_ACCESS_MODE: ${configuredAccessMode}`);
}

export async function openBackoffice(page: Page, path = '/'): Promise<void> {
  if (resolveE2EAccessMode() === 'telegram') {
    await injectTelegramWebApp(page, administratorTelegramInitData);
  }

  await page.goto(path);
}

export function resolveBackofficeApiBaseUrl(): string {
  return process.env.E2E_BASE_URL?.trim() || 'http://127.0.0.1:3000';
}

export function resolveExpectedSessionLabel(): string {
  return resolveE2EAccessMode() === 'test' ? 'Test environment' : 'Telegram-вход';
}

export function resolveExpectedHeroChip(): string {
  return resolveE2EAccessMode() === 'test'
    ? 'FEATURE-001 / test-mode session'
    : 'FEATURE-001 / Telegram guard session';
}
