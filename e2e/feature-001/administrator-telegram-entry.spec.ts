import { expect, test } from '@playwright/test';
import {
  openBackoffice,
  resolveBackofficeApiBaseUrl,
  resolveExpectedHeroChip,
  resolveExpectedSessionLabel,
} from '../support/backoffice-access';

test.describe('FEATURE-001 administrator Telegram entry', () => {
  test('allows administrator to enter via Telegram and open administrative tabs', async ({
    page,
  }) => {
    await openBackoffice(page, '/');

    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByTestId('session-label')).toHaveText(resolveExpectedSessionLabel());
    await expect(page.getByTestId('hero-chip')).toHaveText(resolveExpectedHeroChip());
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

  test('rejects explicit working bootstrap without Telegram context', async ({ request }) => {
    const bootstrapResponse = await request.post(
      new URL('/api/backoffice/access/bootstrap', resolveBackofficeApiBaseUrl()).toString(),
      {
        data: {
          mode: 'telegram',
        },
      },
    );

    expect(bootstrapResponse.status()).toBe(401);
    await expect(bootstrapResponse.json()).resolves.toMatchObject({
      reason: 'telegram-context-required',
      statusCode: 401,
    });
  });
});
