import { expect, test } from "@playwright/test";

import { annotateScenarioIds } from "./support/user-management-auth";
import {
  administratorCapabilities,
  baristaCapabilities,
  bootstrapAssignableUser,
  customerUser,
} from "./support/user-management-fixtures";
import {
  assignRoleThroughDialog,
  expectAssignedRoleResponse,
} from "./support/user-management-flows";
import { mockUserManagementBackend } from "./support/user-management-mock-backend";

test.describe("administrator user role assignment success paths", () => {
  test("FTS-004-002 assign barista role", async ({ page }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-004-002"]);
    const backend = await mockUserManagementBackend(page);

    const responseBody = await assignRoleThroughDialog(page, customerUser);

    expect(backend.rolePatchRequests).toEqual([
      { userId: customerUser.userId, role: "barista" },
    ]);
    expectAssignedRoleResponse(responseBody, customerUser, {
      role: "barista",
      capabilities: baristaCapabilities,
    });
    await expect(page.getByText("Роль пользователя обновлена")).toBeVisible();
    await expect(page.getByText("Бариста", { exact: true })).toBeVisible();
  });

  test("FTS-004-007 assign administrator role by bootstrap administrator", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-004-007"]);
    const backend = await mockUserManagementBackend(page, {
      initialUser: bootstrapAssignableUser,
    });

    const responseBody = await assignRoleThroughDialog(
      page,
      bootstrapAssignableUser,
      "Администратор",
    );

    expect(backend.rolePatchRequests).toEqual([
      { userId: bootstrapAssignableUser.userId, role: "administrator" },
    ]);
    expectAssignedRoleResponse(responseBody, bootstrapAssignableUser, {
      role: "administrator",
      capabilities: administratorCapabilities,
    });
    await expect(page.getByText("Роль пользователя обновлена")).toBeVisible();
    await expect(
      page.getByText("administrator-role-assignment-forbidden"),
    ).toHaveCount(0);
  });
});
