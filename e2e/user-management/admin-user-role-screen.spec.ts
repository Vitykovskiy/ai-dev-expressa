import { expect, test } from "@playwright/test";

import { annotateScenarioIds } from "./support/user-management-auth";
import { customerUser } from "./support/user-management-fixtures";
import { mockUserManagementBackend } from "./support/user-management-mock-backend";
import {
  expectUserRow,
  expectUsersScreenVisible,
  expectVisibleTabs,
  gotoUsersScreen,
} from "./support/user-management-ui";

test.describe("administrator user role management screen", () => {
  test("FTS-004-001 users screen and role assignment entrypoint", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-004-001"]);
    const backend = await mockUserManagementBackend(page);

    await gotoUsersScreen(page);

    await expectUsersScreenVisible(page);
    await expectVisibleTabs(page, [
      "Заказы",
      "Доступность",
      "Меню",
      "Пользователи",
      "Настройки",
    ]);
    await expectUserRow(page, customerUser);
    await expect(page.getByText("Клиент", { exact: true })).toBeVisible();
    await expect(page.getByText("Активен", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Добавить пользователя" }),
    ).toBeEnabled();
    expect(backend.usersReadCount).toBeGreaterThan(0);
  });
});
