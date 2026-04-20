import { describe, expect, it } from "vitest";

const backendBaseUrl = trimTrailingSlash(process.env.E2E_BACKEND_BASE_URL);
const adminTelegramId = process.env.E2E_TEST_TELEGRAM_ID?.trim();
const nonMenuTelegramId = process.env.E2E_NON_MENU_TELEGRAM_ID?.trim();

describe.runIf(backendBaseUrl && adminTelegramId)(
  "Menu catalog VPS e2e",
  () => {
    const runId = `qa005-${Date.now()}`;

    it("lets an administrator manage categories, drink prices, option groups and assignments", async () => {
      const group = await postJson<OptionGroup>(
        "/backoffice/menu/option-groups",
        {
          name: `QA Milk ${runId}`,
          selectionMode: "single",
          options: [
            { name: `QA Regular ${runId}`, priceDelta: 0 },
            { name: `QA Oat ${runId}`, priceDelta: 60 },
          ],
        },
      );

      const category = await postJson<MenuCategory>(
        "/backoffice/menu/categories",
        {
          name: `QA Coffee ${runId}`,
          optionGroupRefs: [group.optionGroupId],
        },
      );

      const item = await postJson<MenuItem>("/backoffice/menu/items", {
        menuCategoryId: category.menuCategoryId,
        name: `QA Latte ${runId}`,
        itemType: "drink",
        basePrice: 0,
        drinkSizePrices: [
          { size: "S", price: 250 },
          { size: "M", price: 300 },
          { size: "L", price: 350 },
        ],
      });

      expect(item.drinkSizePrices).toEqual([
        { size: "S", price: 250 },
        { size: "M", price: 300 },
        { size: "L", price: 350 },
      ]);

      const snapshot = await getJson<MenuCatalogSnapshot>(
        "/backoffice/menu/catalog",
        adminTelegramId,
      );
      const savedCategory = snapshot.categories.find(
        (candidate) => candidate.menuCategoryId === category.menuCategoryId,
      );
      const savedItem = snapshot.items.find(
        (candidate) => candidate.menuItemId === item.menuItemId,
      );
      const savedGroup = snapshot.optionGroups.find(
        (candidate) => candidate.optionGroupId === group.optionGroupId,
      );

      expect(savedCategory?.optionGroupRefs).toEqual([group.optionGroupId]);
      expect(savedItem?.name).toBe(`QA Latte ${runId}`);
      expect(savedGroup?.options).toHaveLength(2);
      expect(
        savedGroup?.options.map((option) => option.priceDelta).sort(),
      ).toEqual([0, 60]);
    });

    it("returns invalid-drink-size-model for an incomplete drink size model", async () => {
      const category = await postJson<MenuCategory>(
        "/backoffice/menu/categories",
        {
          name: `QA Incomplete Drink ${runId}`,
        },
      );

      await expectPostError(
        "/backoffice/menu/items",
        {
          menuCategoryId: category.menuCategoryId,
          name: `QA Broken Latte ${runId}`,
          itemType: "drink",
          drinkSizePrices: [
            { size: "S", price: 250 },
            { size: "M", price: 300 },
          ],
        },
        400,
        "invalid-drink-size-model",
      );
    });

    it("returns invalid-option-group-rule for an unknown selection mode", async () => {
      await expectPostError(
        "/backoffice/menu/option-groups",
        {
          name: `QA Invalid Option Group ${runId}`,
          selectionMode: "exclusive",
          options: [],
        },
        400,
        "invalid-option-group-rule",
      );
    });

    it.runIf(nonMenuTelegramId)(
      "rejects menu catalog access without administrator menu capability",
      async () => {
        const response = await fetch(url("/backoffice/menu/catalog"), {
          headers: {
            "x-test-telegram-id": nonMenuTelegramId ?? "",
          },
        });
        const body = (await response.json()) as ErrorResponse;

        expect(response.status).toBe(403);
        expect(body.message).toBe("backoffice-capability-forbidden");
      },
    );
  },
);

describe.skipIf(backendBaseUrl && adminTelegramId)(
  "Menu catalog VPS e2e config",
  () => {
    it("requires E2E_BACKEND_BASE_URL and E2E_TEST_TELEGRAM_ID", () => {
      expect(backendBaseUrl, "E2E_BACKEND_BASE_URL").toBeTruthy();
      expect(adminTelegramId, "E2E_TEST_TELEGRAM_ID").toBeTruthy();
    });
  },
);

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(url(path), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-test-telegram-id": adminTelegramId ?? "",
    },
    body: JSON.stringify(payload),
  });

  expect(response.status).toBe(201);
  return (await response.json()) as T;
}

async function getJson<T>(
  path: string,
  telegramId: string | undefined,
): Promise<T> {
  const response = await fetch(url(path), {
    headers: {
      "x-test-telegram-id": telegramId ?? "",
    },
  });

  expect(response.status).toBe(200);
  return (await response.json()) as T;
}

async function expectPostError(
  path: string,
  payload: unknown,
  expectedStatus: number,
  expectedMessage: string,
): Promise<void> {
  const response = await fetch(url(path), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-test-telegram-id": adminTelegramId ?? "",
    },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as ErrorResponse;

  expect(response.status).toBe(expectedStatus);
  expect(body.message).toBe(expectedMessage);
}

function url(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${backendBaseUrl}${normalizedPath}`;
}

function trimTrailingSlash(value: string | undefined): string | undefined {
  return value?.trim().replace(/\/$/, "");
}

interface MenuCatalogSnapshot {
  readonly categories: readonly MenuCategory[];
  readonly items: readonly MenuItem[];
  readonly optionGroups: readonly OptionGroup[];
}

interface MenuCategory {
  readonly menuCategoryId: string;
  readonly name: string;
  readonly optionGroupRefs: readonly string[];
}

interface MenuItem {
  readonly menuItemId: string;
  readonly menuCategoryId: string;
  readonly name: string;
  readonly itemType: "drink" | "regular";
  readonly basePrice: number;
  readonly drinkSizePrices: readonly DrinkSizePrice[];
}

interface DrinkSizePrice {
  readonly size: "S" | "M" | "L";
  readonly price: number;
}

interface OptionGroup {
  readonly optionGroupId: string;
  readonly name: string;
  readonly selectionMode: "single" | "multiple";
  readonly options: readonly Option[];
}

interface Option {
  readonly optionId: string;
  readonly optionGroupId: string;
  readonly name: string;
  readonly priceDelta: number;
}

interface ErrorResponse {
  readonly message: string;
}
