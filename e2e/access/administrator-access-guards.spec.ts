import { expect, test } from "@playwright/test";

import {
  administratorActor,
  annotateScenarioIds,
  baristaActor,
  expectEntryDenied,
  expectHiddenTabs,
  expectVisibleTabs,
  mockSessionBootstrap,
} from "./support/access-helpers";

test.describe("administrator access guard coverage", () => {
  test("FTS-001-003 visible tabs are derived from backend capabilities", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-003"]);

    await mockSessionBootstrap(page, () => baristaActor);

    await page.goto("/");

    await expect(page.getByText("Бариста")).toBeVisible();
    await expectVisibleTabs(page, ["Заказы", "Доступность"]);
    await expectHiddenTabs(page, ["Меню", "Пользователи", "Настройки"]);
  });

  test("FTS-001-004 direct barista route without capability resolves to forbidden", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-004"]);

    await mockSessionBootstrap(page, () => baristaActor);

    await page.goto("/menu");

    await expect(page).toHaveURL(/\/forbidden(?:\?|$)/);
    await expect(page.getByText("403")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Доступ к этой вкладке запрещён" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { exact: true, name: "Меню" }),
    ).toHaveCount(0);
  });

  test("FTS-001-004 administrator keeps direct route access to allowed capability", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-004"]);

    await mockSessionBootstrap(page, () => administratorActor);

    await page.goto("/menu");

    await expect(page).toHaveURL(/\/menu$/);
    await expect(
      page.getByRole("heading", { exact: true, name: "Меню" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Добавить группу" }),
    ).toBeVisible();
    await expect(page.getByText("403")).toHaveCount(0);
  });

  test("FTS-001-004 unauthenticated direct route resolves to entry-denied", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-004"]);

    await mockSessionBootstrap(page, () => ({
      status: 401,
      code: "telegram-init-data-required",
    }));

    await page.goto("/menu");

    await expectEntryDenied(page, "telegram-init-data-required");
  });
});
