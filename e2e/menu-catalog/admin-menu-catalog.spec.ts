import {
  expect,
  type APIRequestContext,
  type Locator,
  test,
} from "@playwright/test";

const ADMIN_TELEGRAM_ID = "123456789";
const NON_MENU_TELEGRAM_ID = "2002";

test.describe("administrator menu catalog management", () => {
  test("administrator manages menu catalog through backoffice", async ({
    page,
    request,
  }) => {
    const suffix = Date.now().toString(36);
    const categoryName = `Кофе E2E ${suffix}`;
    const optionGroupName = `Сиропы E2E ${suffix}`;
    const drinkName = `Латте E2E ${suffix}`;
    const freeOptionName = `Корица E2E ${suffix}`;
    const paidOptionName = `Ваниль E2E ${suffix}`;

    await page.goto("/menu");
    await expect(
      page.getByRole("heading", { exact: true, name: "Меню" }),
    ).toBeVisible();

    await createCategory(page, categoryName);
    await expect(page.getByText(categoryName, { exact: true })).toBeVisible();

    await createDrink(page, {
      categoryName,
      name: drinkName,
      prices: { S: "190", M: "230", L: "270" },
    });

    await expandCategory(page, categoryName);
    await expect(page.getByText(drinkName, { exact: true })).toBeVisible();
    await expect(page.getByText("от 190 ₽")).toBeVisible();

    await createCategory(page, optionGroupName, { isOptionGroup: true });
    await expect(
      page.getByText(optionGroupName, { exact: true }),
    ).toBeVisible();

    await createRegularItem(page, {
      categoryName: optionGroupName,
      name: freeOptionName,
      price: "0",
    });
    await createRegularItem(page, {
      categoryName: optionGroupName,
      name: paidOptionName,
      price: "35",
    });

    await expandCategory(page, optionGroupName);
    await expect(page.getByText(freeOptionName, { exact: true })).toBeVisible();
    await expect(page.getByText(paidOptionName, { exact: true })).toBeVisible();

    await assignOptionGroupToCategory(page, {
      categoryName,
      optionGroupName,
    });

    const catalog = await getCatalog(request);
    const category = catalog.categories.find(
      (entry) => entry.name === categoryName,
    );
    const optionGroup = catalog.optionGroups.find(
      (entry) => entry.name === optionGroupName,
    );
    const drink = catalog.items.find((entry) => entry.name === drinkName);
    const freeOption = catalog.items.find(
      (entry) => entry.name === freeOptionName,
    );
    const paidOption = catalog.items.find(
      (entry) => entry.name === paidOptionName,
    );

    expect(category, "created category").toBeTruthy();
    expect(optionGroup, "created option group").toBeTruthy();
    expect(drink).toMatchObject({
      itemType: "drink",
      name: drinkName,
    });
    expect(drink?.drinkSizePrices).toEqual(
      expect.arrayContaining([
        { size: "S", price: 190 },
        { size: "M", price: 230 },
        { size: "L", price: 270 },
      ]),
    );
    expect(freeOption).toMatchObject({ basePrice: 0, name: freeOptionName });
    expect(paidOption).toMatchObject({ basePrice: 35, name: paidOptionName });
    expect(category?.optionGroupRefs).toContain(optionGroup?.optionGroupId);
    expect(optionGroup?.selectionMode).toBe("multiple");
  });

  test("incomplete drink size model is rejected", async ({ page }) => {
    const suffix = Date.now().toString(36);
    const categoryName = `Валидация E2E ${suffix}`;

    await page.goto("/menu");
    await createCategory(page, categoryName);

    await page.getByRole("button", { name: "Добавить товар" }).click();
    await expect(
      page.getByRole("heading", { name: "Новый товар" }),
    ).toBeVisible();
    await selectOption(page, fieldByLabel(page, "Категория"), categoryName);
    await fieldByLabel(page, "Название товара")
      .locator("input")
      .fill(`Раф E2E ${suffix}`);
    await toggleRow(page, "Размеры S / M / L");
    await page.locator("#menu-item-size-price-s").fill("210");
    await dialogButton(page, "Добавить товар").click();

    await expect(
      page.getByText("Укажите цены для размеров S, M и L"),
    ).toBeVisible();
  });

  test("invalid option group rule is rejected by menu catalog contract", async ({
    request,
  }) => {
    const response = await apiPost(request, "/backoffice/menu/option-groups", {
      name: `Bad option group ${Date.now()}`,
      selectionMode: "unsupported",
      options: [],
    });

    expect(response.status()).toBe(400);
    await expectJsonMessage(response, "invalid-option-group-rule");
  });

  test("direct menu API access is denied when menu access is unavailable", async ({
    request,
  }) => {
    const response = await request.get(
      `${backendBaseUrl()}/backoffice/menu/catalog`,
      {
        headers: { "x-test-telegram-id": NON_MENU_TELEGRAM_ID },
      },
    );

    expect(response.status()).toBe(403);
    await expectJsonMessage(
      response,
      /backoffice-(capability-forbidden|user-not-found)/,
    );
  });
});

async function createCategory(
  page: Parameters<typeof fieldByLabel>[0],
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

async function createDrink(
  page: Parameters<typeof fieldByLabel>[0],
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
  await dialogButton(page, "Добавить товар").click();
  await expect(page.getByRole("heading", { name: "Новый товар" })).toBeHidden();
}

async function createRegularItem(
  page: Parameters<typeof fieldByLabel>[0],
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
  await dialogButton(page, "Добавить товар").click();
  await expect(page.getByRole("heading", { name: "Новый товар" })).toBeHidden();
}

async function assignOptionGroupToCategory(
  page: Parameters<typeof fieldByLabel>[0],
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

async function expandCategory(
  page: Parameters<typeof fieldByLabel>[0],
  categoryName: string,
): Promise<void> {
  const block = categoryBlock(page, categoryName);
  const main = block
    .getByRole("button")
    .filter({ hasText: categoryName })
    .first();
  await main.click();
}

function categoryBlock(
  page: Parameters<typeof fieldByLabel>[0],
  categoryName: string,
): Locator {
  return page.locator(".category-block").filter({
    has: page.getByText(categoryName, { exact: true }),
  });
}

function fieldByLabel(
  page: { locator: (selector: string) => Locator },
  label: string,
): Locator {
  return page.locator("label").filter({
    has: page.getByText(label, { exact: true }),
  });
}

async function selectOption(
  page: Parameters<typeof fieldByLabel>[0],
  field: Locator,
  optionName: string,
): Promise<void> {
  await field.locator(".v-field").click();
  await page.getByRole("option", { name: optionName }).click();
}

async function toggleRow(
  page: Parameters<typeof fieldByLabel>[0],
  label: string,
): Promise<void> {
  await page
    .locator(".app-toggle-row")
    .filter({ hasText: label })
    .getByRole("checkbox")
    .click();
}

function dialogButton(
  page: Parameters<typeof fieldByLabel>[0],
  name: string,
): Locator {
  return page.getByRole("dialog").getByRole("button", { name });
}

async function getCatalog(
  request: APIRequestContext,
): Promise<MenuCatalogSnapshot> {
  const response = await request.get(
    `${backendBaseUrl()}/backoffice/menu/catalog`,
    {
      headers: authHeaders(),
    },
  );
  expect(response.ok()).toBe(true);
  return (await response.json()) as MenuCatalogSnapshot;
}

async function apiPost(
  request: APIRequestContext,
  path: string,
  body: unknown,
) {
  return request.post(`${backendBaseUrl()}${path}`, {
    headers: {
      ...authHeaders(),
      "content-type": "application/json",
    },
    data: body,
  });
}

async function expectJsonMessage(
  response: { json: () => Promise<unknown> },
  expected: string | RegExp,
): Promise<void> {
  const body = (await response.json()) as { readonly message?: string };
  if (expected instanceof RegExp) {
    expect(body.message).toMatch(expected);
    return;
  }

  expect(body.message).toBe(expected);
}

function authHeaders(): Record<string, string> {
  return { "x-test-telegram-id": ADMIN_TELEGRAM_ID };
}

function backendBaseUrl(): string {
  return process.env.E2E_BACKEND_BASE_URL ?? "http://127.0.0.1:3000";
}

interface MenuCatalogSnapshot {
  readonly categories: readonly {
    readonly menuCategoryId: string;
    readonly name: string;
    readonly optionGroupRefs: readonly string[];
  }[];
  readonly items: readonly {
    readonly name: string;
    readonly itemType: "regular" | "drink";
    readonly basePrice?: number;
    readonly drinkSizePrices?: readonly {
      readonly size: "S" | "M" | "L";
      readonly price: number;
    }[];
  }[];
  readonly optionGroups: readonly {
    readonly optionGroupId: string;
    readonly name: string;
    readonly selectionMode: "single" | "multiple";
  }[];
}
