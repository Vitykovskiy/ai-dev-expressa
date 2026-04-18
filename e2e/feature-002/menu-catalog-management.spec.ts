import { expect, test, type Locator, type Page } from '@playwright/test';
import { injectTelegramWebApp } from '../support/backoffice-telegram-web-app';
import {
  createSignedTelegramInitData,
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
} from '../support/telegram-init-data';

const administratorTelegramInitData = createSignedTelegramInitData(
  FEATURE_001_E2E_ADMIN_TELEGRAM_ID,
  FEATURE_001_E2E_BACKOFFICE_BOT_TOKEN,
);

function uniqueScenarioSuffix(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function inputByTestId(page: Page, testId: string): Locator {
  return page.getByTestId(testId).locator('input');
}

function categoryCard(page: Page, categoryName: string): Locator {
  return page.getByTestId('menu-category-card').filter({ hasText: categoryName });
}

function productCard(page: Page, productName: string): Locator {
  return page.getByTestId('menu-product-card').filter({ hasText: productName });
}

test.describe('FEATURE-002 menu catalog management', () => {
  test('allows administrator to save category, product price and addon group in the catalog', async ({
    page,
  }) => {
    const suffix = uniqueScenarioSuffix();
    const categoryName = `E2E Категория ${suffix}`;
    const productName = `E2E Брауни ${suffix}`;
    const optionGroupName = `E2E Добавки ${suffix}`;
    const freeOptionName = `Без сахара ${suffix}`;
    const paidOptionName = `Сироп ${suffix}`;

    await injectTelegramWebApp(page, administratorTelegramInitData);

    await page.goto('/menu/categories');

    await expect(page).toHaveURL(/\/menu\/categories$/);
    await expect(page.getByTestId('session-label')).toHaveText('Telegram-вход');
    await expect(page.getByTestId('nav-item-menu')).toBeVisible();
    await expect(page.getByTestId('page-title')).toHaveText('Категории каталога');

    await page.getByTestId('create-category').click();
    await inputByTestId(page, 'category-name-input').fill(categoryName);
    await page.getByTestId('submit-category-form').click();

    const createdCategoryCard = categoryCard(page, categoryName);
    await expect(createdCategoryCard).toBeVisible();
    await expect(createdCategoryCard).toContainText('0 товаров');
    await expect(createdCategoryCard).toContainText('0 групп допов');

    await createdCategoryCard.getByRole('button', { name: 'Открыть товары' }).click();
    await expect(page.getByTestId('page-title')).toHaveText(
      `Товары категории «${categoryName}»`,
    );

    await page.getByTestId('create-product').click();
    await expect(page.getByTestId('page-title')).toHaveText('Новый товар');
    await inputByTestId(page, 'product-name-input').fill(productName);
    await inputByTestId(page, 'product-base-price-input').fill('310');
    await page.getByTestId('submit-product-form').click();

    await expect(page.getByTestId('product-draft-message')).toHaveText(
      'Товар добавлен в черновик каталога.',
    );
    await page
      .getByTestId('menu-product-editor')
      .getByRole('button', { name: 'К списку товаров' })
      .click();

    const createdProductCard = productCard(page, productName);
    await expect(createdProductCard).toBeVisible();
    await expect(createdProductCard).toContainText('310 ₽');

    await page.getByTestId('create-addon-group').click();
    await expect(page.getByTestId('page-title')).toHaveText(
      'Новая группа дополнительных опций',
    );
    await inputByTestId(page, 'addon-group-name-input').fill(optionGroupName);

    const categoryAssignment = page
      .locator('label')
      .filter({ hasText: categoryName })
      .locator('input[type="checkbox"]');
    await expect(categoryAssignment).toBeChecked();

    await inputByTestId(page, 'addon-option-name-0').fill(freeOptionName);
    await inputByTestId(page, 'addon-option-price-delta-0').fill('0');
    await page.getByTestId('add-addon-option').click();
    await inputByTestId(page, 'addon-option-name-1').fill(paidOptionName);
    await inputByTestId(page, 'addon-option-price-delta-1').fill('45');
    await page.getByTestId('submit-addon-group-form').click();

    await expect(page.getByTestId('addon-group-draft-message')).toHaveText(
      'Группа дополнительных опций добавлена в черновик каталога.',
    );
    await expect(page.getByText(freeOptionName)).toBeVisible();
    await expect(page.getByText('+45 ₽')).toBeVisible();
    await expect(page.getByTestId('menu-catalog-save-panel')).toContainText(
      'Есть несохранённые изменения',
    );

    const saveResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/backoffice/menu/catalog') &&
        response.request().method() === 'PUT' &&
        response.status() === 200,
    );
    await page.getByTestId('save-menu-catalog').click();
    await saveResponse;

    await expect(page.getByTestId('menu-catalog-save-panel')).toContainText(
      'Каталог синхронизирован',
    );

    await page.reload();

    await expect(page.getByTestId('page-title')).toHaveText(optionGroupName);
    await expect(categoryAssignment).toBeChecked();
    await expect(page.getByText(freeOptionName)).toBeVisible();
    await expect(page.getByText('+45 ₽')).toBeVisible();

    await page
      .getByTestId('menu-addon-group-editor')
      .getByRole('button', { name: 'К товарам категории' })
      .click();
    await expect(page.getByTestId('page-title')).toHaveText(
      `Товары категории «${categoryName}»`,
    );
    await expect(productCard(page, productName)).toContainText('310 ₽');
    await expect(page.getByRole('button', { name: optionGroupName })).toBeVisible();

    await page.getByRole('button', { name: 'К категориям' }).click();
    await expect(categoryCard(page, categoryName)).toContainText('1 товаров');
    await expect(categoryCard(page, categoryName)).toContainText('1 групп допов');
  });
});
