import { expect, test } from "@playwright/test";

import {
  annotateScenarioIds,
  expectVisibleTabs,
  type ManagedUser,
} from "./support/access-helpers";

test.describe("administrator user role list", () => {
  test("F004-SC-001 administrator sees users list", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["F004-SC-001"]);

    const sessionResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/backoffice/auth/session") &&
        response.request().method() === "POST",
    );
    const usersResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/backoffice/user-management/users") &&
        response.request().method() === "GET",
    );

    await page.goto("/users");

    const [sessionResponse, usersResponse] = await Promise.all([
      sessionResponsePromise,
      usersResponsePromise,
    ]);
    const listBody = (await usersResponse.json()) as {
      readonly users: readonly ManagedUser[];
    };

    expect(sessionResponse.ok()).toBe(true);
    expect(usersResponse.status()).toBe(200);
    expect(Array.isArray(listBody.users)).toBe(true);

    await expect(
      page.getByRole("heading", { exact: true, name: "Пользователи" }),
    ).toBeVisible();
    await expectVisibleTabs(page, [
      "Заказы",
      "Доступность",
      "Меню",
      "Пользователи",
      "Настройки",
    ]);

    if (listBody.users.length > 0) {
      await expect(
        page.getByText(`@${listBody.users[0].telegramId}`),
      ).toBeVisible();
      await expect(
        page.getByText(listBody.users[0].blocked ? "Заблокирован" : "Активен", {
          exact: true,
        }),
      ).toBeVisible();
      return;
    }

    await expect(page.getByText("Пользователей нет")).toBeVisible();
  });
});
