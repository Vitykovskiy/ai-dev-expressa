import { expect, test } from "@playwright/test";

import {
  categoryBlock,
  createCategory,
  createRegularItem,
  dialogButton,
  fieldByLabel,
  selectOption,
  toggleRow,
} from "./support/menu-catalog-ui";

test.describe("administrator menu catalog validation", () => {
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
    await dialogButton(page, "Добавить товар").click();

    await expect(
      page.getByText("Укажите цены для размеров S, M и L"),
    ).toBeVisible();
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

function annotateScenarioIds(
  testInfo: { annotations: { type: string; description?: string }[] },
  scenarioIds: readonly string[],
): void {
  for (const scenarioId of scenarioIds) {
    testInfo.annotations.push({ type: "scenario", description: scenarioId });
  }
}
