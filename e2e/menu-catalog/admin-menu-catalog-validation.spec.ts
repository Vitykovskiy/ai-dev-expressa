import { expect, test } from "@playwright/test";

import {
  createCategory,
  dialogButton,
  fieldByLabel,
  selectOption,
  toggleRow,
} from "./support/menu-catalog-ui";

test.describe("administrator menu catalog validation", () => {
  test("incomplete drink size model is rejected", async ({ page }, testInfo) => {
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
});

function annotateScenarioIds(
  testInfo: { annotations: { type: string; description?: string }[] },
  scenarioIds: readonly string[],
): void {
  for (const scenarioId of scenarioIds) {
    testInfo.annotations.push({ type: "scenario", description: scenarioId });
  }
}
