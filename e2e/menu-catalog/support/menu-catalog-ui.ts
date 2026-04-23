import { expect, type Locator, type Page } from "@playwright/test";

export async function createCategory(
  page: Page,
  name: string,
  options: { readonly isOptionGroup?: boolean } = {},
): Promise<void> {
  await page.getByRole("button", { name: "Добавить группу" }).click();
  await expect(
    page.getByRole("heading", { name: "Новая группа" }),
  ).toBeVisible();
  await fieldByLabel(page, "Название группы").locator("input").fill(name);

  if (options.isOptionGroup) {
    await toggleRow(page, "Группа опций");
  }

  await page.getByRole("button", { name: "Добавить категорию" }).click();
  await expect(
    page.getByRole("heading", { name: "Новая группа" }),
  ).toBeHidden();
}

export async function createDrink(
  page: Page,
  input: {
    readonly categoryName: string;
    readonly name: string;
    readonly prices: Record<"S" | "M" | "L", string>;
  },
): Promise<void> {
  await page.getByRole("button", { name: "Добавить товар" }).click();
  await expect(
    page.getByRole("heading", { name: "Новый товар" }),
  ).toBeVisible();
  await selectOption(page, fieldByLabel(page, "Категория"), input.categoryName);
  await fieldByLabel(page, "Название товара").locator("input").fill(input.name);
  await toggleRow(page, "Размеры S / M / L");
  await page.locator("#menu-item-size-price-s").fill(input.prices.S);
  await page.locator("#menu-item-size-price-m").fill(input.prices.M);
  await page.locator("#menu-item-size-price-l").fill(input.prices.L);
  await submitDialog(page);
  await expect(page.getByRole("heading", { name: "Новый товар" })).toBeHidden();
}

export async function createRegularItem(
  page: Page,
  input: {
    readonly categoryName: string;
    readonly name: string;
    readonly price: string;
  },
): Promise<void> {
  await page.getByRole("button", { name: "Добавить товар" }).click();
  await expect(
    page.getByRole("heading", { name: "Новый товар" }),
  ).toBeVisible();
  await selectOption(page, fieldByLabel(page, "Категория"), input.categoryName);
  await fieldByLabel(page, "Название товара").locator("input").fill(input.name);
  await fieldByLabel(page, "Цена, ₽").locator("input").fill(input.price);
  await submitDialog(page);
  await expect(page.getByRole("dialog")).toBeHidden();
}

export async function assignOptionGroupToCategory(
  page: Page,
  input: {
    readonly categoryName: string;
    readonly optionGroupName: string;
  },
): Promise<void> {
  await categoryBlock(page, input.categoryName)
    .getByTitle("Редактировать группу")
    .click();
  await expect(
    page.getByRole("heading", { name: "Редактировать группу" }),
  ).toBeVisible();
  await selectOption(
    page,
    fieldByLabel(page, "Выбрать группу опций"),
    input.optionGroupName,
  );
  await page.getByRole("button", { name: "Сохранить изменения" }).click();
  await expect(
    page.getByRole("heading", { name: "Редактировать группу" }),
  ).toBeHidden();
}

export async function expandCategory(
  page: Page,
  categoryName: string,
): Promise<void> {
  const block = categoryBlock(page, categoryName);
  const main = block
    .getByRole("button")
    .filter({ hasText: categoryName })
    .first();
  await main.click();
}

export function categoryBlock(page: Page, categoryName: string): Locator {
  return page.locator(".category-block").filter({
    has: page.getByText(categoryName, { exact: true }),
  });
}

export function fieldByLabel(
  page: { locator: (selector: string) => Locator },
  label: string,
): Locator {
  return page.locator("label").filter({
    has: page.getByText(label, { exact: true }),
  });
}

export async function selectOption(
  page: Page,
  field: Locator,
  optionName: string,
): Promise<void> {
  await field.locator(".v-field").click();
  await page.getByRole("option", { name: optionName }).click();
}

export async function toggleRow(page: Page, label: string): Promise<void> {
  await page
    .locator(".app-toggle-row")
    .filter({ hasText: label })
    .getByRole("checkbox")
    .click();
}

export function dialogButton(page: Page, name: string): Locator {
  return page.getByRole("dialog").getByRole("button", { name });
}

async function submitDialog(page: Page): Promise<void> {
  await page
    .getByRole("dialog")
    .locator('button[type="submit"], button[form="menu-item-dialog-form"]')
    .first()
    .click();
}
