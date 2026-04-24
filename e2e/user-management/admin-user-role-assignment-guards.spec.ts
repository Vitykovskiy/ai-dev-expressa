import { expect, test } from "@playwright/test";

import { annotateScenarioIds } from "./support/user-management-auth";
import { patchUserRoleFromBrowser } from "./support/user-management-api";
import {
  baristaActor,
  baristaTelegramId,
  bootstrapAssignableUser,
  customerUser,
  ordinaryAdministratorActor,
} from "./support/user-management-fixtures";
import { waitForRolePatchResponse } from "./support/user-management-flows";
import { mockUserManagementBackend } from "./support/user-management-mock-backend";
import {
  expectForbiddenScreen,
  expectHiddenTabs,
  expectUserRow,
  expectUsersScreenVisible,
  gotoUsersScreen,
  openAssignmentDialog,
  selectDialogRole,
  submitAssignmentDialog,
} from "./support/user-management-ui";

test.describe("administrator user role assignment guards", () => {
  test("FTS-004-005 invalid assignable role", async ({ page }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-004-005"]);
    const backend = await mockUserManagementBackend(page);

    await gotoUsersScreen(page);
    await expectUsersScreenVisible(page);

    const invalidRoleResponse = await patchUserRoleFromBrowser(
      page,
      customerUser.userId,
      { role: "customer" },
    );

    expect(invalidRoleResponse).toEqual({
      status: 422,
      body: { message: "role-not-assignable" },
    });
    expect(backend.rolePatchRequests).toEqual([
      { userId: customerUser.userId, role: "customer" },
    ]);
    await expect(page.getByText("Роль пользователя обновлена")).toHaveCount(0);
    const row = await expectUserRow(page, customerUser);
    await expect(row.getByText("Клиент", { exact: true })).toBeVisible();
  });

  test("FTS-004-006 role assignment access guard", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-004-006"]);
    const backend = await mockUserManagementBackend(page, {
      actor: baristaActor,
    });

    await gotoUsersScreen(page);
    await expectForbiddenScreen(page);
    await expectHiddenTabs(page, ["Меню", "Пользователи", "Настройки"]);

    const forbiddenRoleResponse = await patchUserRoleFromBrowser(
      page,
      customerUser.userId,
      { role: "barista" },
      baristaTelegramId,
    );

    expect(forbiddenRoleResponse).toEqual({
      status: 403,
      body: { message: "backoffice-capability-forbidden" },
    });
    expect(backend.rolePatchRequests).toEqual([
      { userId: customerUser.userId, role: "barista" },
    ]);
  });

  test("FTS-004-008 forbid administrator role assignment for non-bootstrap administrator", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-004-008"]);
    const backend = await mockUserManagementBackend(page, {
      actor: ordinaryAdministratorActor,
      initialUser: bootstrapAssignableUser,
    });

    await gotoUsersScreen(page);
    await expectUsersScreenVisible(page);
    await openAssignmentDialog(page);
    await selectDialogRole(page, "Администратор");

    const roleResponsePromise = waitForRolePatchResponse(
      page,
      bootstrapAssignableUser,
    );
    await submitAssignmentDialog(page);
    const roleResponse = await roleResponsePromise;
    const responseBody = (await roleResponse.json()) as { message?: string };

    expect(roleResponse.status()).toBe(403);
    expect(responseBody).toEqual({
      message: "administrator-role-assignment-forbidden",
    });
    expect(backend.rolePatchRequests).toEqual([
      { userId: bootstrapAssignableUser.userId, role: "administrator" },
    ]);
    await expect(page.getByText("Роль пользователя обновлена")).toHaveCount(0);
    const row = await expectUserRow(page, bootstrapAssignableUser);
    await expect(row.getByText("Клиент", { exact: true })).toBeVisible();
  });
});
