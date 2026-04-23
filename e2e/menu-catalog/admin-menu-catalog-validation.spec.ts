import { expect, test } from "@playwright/test";

import {
  annotateScenarioIds,
  baristaActor,
  expectHiddenTabs,
  forbiddenHeading,
  mockSessionBootstrap,
} from "./support/menu-catalog-auth";
import {
  categoryBlock,
  createCategory,
  createRegularItem,
  fieldByLabel,
  selectOption,
  toggleRow,
} from "./support/menu-catalog-ui";

test.describe("administrator menu catalog validation", () => {
  test("FTS-002-007 menu tab is hidden and direct route is forbidden without menu capability", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-002-007"]);

    await mockSessionBootstrap(page, () => baristaActor);

    await page.goto("/");

    await expect(page.getByText("Бариста")).toBeVisible();
    await expectHiddenTabs(page, ["Меню"]);

    await page.goto("/menu");

    await expect(page).toHaveURL(/\/forbidden(?:\?|$)/);
    await expect(page.getByText("403")).toBeVisible();
    await expect(forbiddenHeading(page)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Добавить группу" }),
    ).toHaveCount(0);
  });

  test("incomplete drink size model is rejected", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-002-008"]);
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
    const submitButton = page
      .getByRole("dialog")
      .getByRole("button", { name: "Добавить товар" });

    await expect(submitButton).toBeDisabled();
    await expect(
      page.getByRole("heading", { name: "Новый товар" }),
    ).toBeVisible();
    await expect(page.locator("#menu-item-size-price-s")).toHaveValue("210");
    await expect(page.locator("#menu-item-size-price-m")).toHaveValue("");
    await expect(page.locator("#menu-item-size-price-l")).toHaveValue("");
  });

  test("category with products cannot be deleted", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-002-009"]);
    const suffix = Date.now().toString(36);
    const categoryName = `Удаление E2E ${suffix}`;
    const itemName = `Латте E2E ${suffix}`;

    await page.goto("/menu");
    await createCategory(page, categoryName);
    await createRegularItem(page, {
      categoryName,
      name: itemName,
      price: "190",
    });

    page.once("dialog", (dialog) => dialog.accept());
    await categoryBlock(page, categoryName)
      .getByTitle("Редактировать группу")
      .click();
    await expect(
      page.getByRole("heading", { name: "Редактировать группу" }),
    ).toBeVisible();
    await page.getByTitle("Удалить группу").click();
    await expect(
      page.getByRole("heading", { name: "Редактировать группу" }),
    ).toBeVisible();
    await expect(page.getByText(categoryName, { exact: true })).toBeVisible();
    await expect(
      categoryBlock(page, categoryName).getByText("1 товар", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Отмена" }).click();
    await expect(
      page.getByRole("heading", { name: "Редактировать группу" }),
    ).toBeHidden();

    await categoryBlock(page, categoryName)
      .getByRole("button")
      .filter({ hasText: categoryName })
      .first()
      .click();
    await expect(page.getByText(itemName, { exact: true })).toBeVisible();
  });
});
