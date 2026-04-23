import { expect, test } from "@playwright/test";

import { getCatalog } from "./support/menu-catalog-api";
import { annotateScenarioIds } from "./support/menu-catalog-auth";
import {
  assignOptionGroupToCategory,
  createCategory,
  createDrink,
  createRegularItem,
  expandCategory,
} from "./support/menu-catalog-ui";

test.describe("administrator menu catalog management", () => {
  test("FTS-002-002 administrator creates a regular item with a base price", async ({
    page,
    request,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-002-002"]);
    const suffix = Date.now().toString(36);
    const categoryName = `Обычная группа E2E ${suffix}`;
    const itemName = `Американо E2E ${suffix}`;

    await page.goto("/menu");
    await expect(
      page.getByRole("heading", { exact: true, name: "Меню" }),
    ).toBeVisible();

    await createCategory(page, categoryName);
    await createRegularItem(page, {
      categoryName,
      name: itemName,
      price: "180",
    });

    await expandCategory(page, categoryName);
    await expect(page.getByText(itemName, { exact: true })).toBeVisible();

    const catalog = await getCatalog(request);
    const item = catalog.items.find((entry) => entry.name === itemName);

    expect(item).toMatchObject({
      itemType: "regular",
      name: itemName,
      basePrice: 180,
    });
    expect(item?.drinkSizePrices ?? []).toEqual([]);
  });

  test("administrator manages menu catalog through backoffice", async ({
    page,
    request,
  }, testInfo) => {
    annotateScenarioIds(testInfo, [
      "FTS-002-001",
      "FTS-002-002",
      "FTS-002-003",
      "FTS-002-004",
      "FTS-002-005",
      "FTS-002-006",
    ]);
    const suffix = Date.now().toString(36);
    const categoryName = `Кофе E2E ${suffix}`;
    const optionGroupName = `Сиропы E2E ${suffix}`;
    const regularItemName = `Круассан E2E ${suffix}`;
    const drinkName = `Латте E2E ${suffix}`;
    const freeOptionName = `Корица E2E ${suffix}`;
    const paidOptionName = `Ваниль E2E ${suffix}`;

    await page.goto("/menu");
    await expect(
      page.getByRole("heading", { exact: true, name: "Меню" }),
    ).toBeVisible();

    await createCategory(page, categoryName);
    await expect(page.getByText(categoryName, { exact: true })).toBeVisible();

    await createRegularItem(page, {
      categoryName,
      name: regularItemName,
      price: "160",
    });
    await createDrink(page, {
      categoryName,
      name: drinkName,
      prices: { S: "190", M: "230", L: "270" },
    });

    await expandCategory(page, categoryName);
    await expect(
      page.getByText(regularItemName, { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(drinkName, { exact: true })).toBeVisible();
    await expect(
      page.getByText("S: 190 ₽ · M: 230 ₽ · L: 270 ₽", { exact: true }),
    ).toBeVisible();

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
    const regularItem = catalog.items.find(
      (entry) => entry.name === regularItemName,
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
    expect(regularItem).toMatchObject({
      itemType: "regular",
      name: regularItemName,
      basePrice: 160,
    });
    expect(regularItem?.drinkSizePrices ?? []).toEqual([]);
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
});
