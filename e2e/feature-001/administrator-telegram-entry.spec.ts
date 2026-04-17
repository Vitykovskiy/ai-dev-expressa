import { expect, test, type Page } from '@playwright/test';
import {
  createSignedTelegramInitData,
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
} from '../support/telegram-init-data';

const administratorTelegramInitData = createSignedTelegramInitData(
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
);

async function injectTelegramWebApp(page: Page, initData: string): Promise<void> {
  await page.addInitScript(
    (payload) => {
      (window as Window & {
        Telegram?: {
          WebApp?: {
            expand?: () => void;
            initData?: string;
            ready?: () => void;
          };
        };
      }).Telegram = {
        WebApp: {
          initData: payload.initData,
          ready: () => undefined,
          expand: () => undefined,
        },
      };
    },
    { initData },
  );
}

test.describe('FEATURE-001 administrator Telegram entry', () => {
  test('allows administrator to enter via Telegram and open administrative tabs', async ({
    page,
  }) => {
    await injectTelegramWebApp(page, administratorTelegramInitData);

    await page.goto('/');

    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByTestId('session-label')).toHaveText('Telegram-вход');
    await expect(page.getByTestId('hero-chip')).toHaveText('FEATURE-001 / Telegram guard session');
    await expect(page.locator('[data-testid^="nav-item-"]')).toHaveCount(5);

    for (const { tab, path, title } of [
      { tab: 'menu', path: '/menu/categories', title: 'Категории каталога' },
      { tab: 'users', path: '/users', title: 'Пользователи' },
      { tab: 'settings', path: '/settings', title: 'Настройки' },
    ] as const) {
      await page.getByTestId(`nav-item-${tab}`).click();
      await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}$`));
      await expect(page.getByTestId('page-title')).toHaveText(title);
    }
  });

  test('rejects direct working access without Telegram context', async ({ page }) => {
    await page.goto('/users');

    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByTestId('blocking-state')).toBeVisible();
    await expect(page.getByTestId('blocking-state-title')).toHaveText('Нужен Telegram-контекст');
    await expect(page.getByTestId('blocking-state-reason')).toContainText(
      'telegram-context-required',
    );
    await expect(page.getByTestId('session-label')).toHaveText('Отказ в доступе');
    await expect(page.getByTestId('session-summary')).toContainText('Telegram-контекст');
  });
});
