import { expect, type Page, type Response } from "@playwright/test";

import type {
  AssignUserRoleResponse,
  UserManagementAssignableRole,
  UserManagementCapability,
  UserManagementUser,
} from "./user-management-types";
import {
  expectUsersScreenVisible,
  gotoUsersScreen,
  openAssignmentDialog,
  selectDialogRole,
  submitAssignmentDialog,
} from "./user-management-ui";

export async function assignRoleThroughDialog(
  page: Page,
  user: UserManagementUser,
  roleLabel?: string,
): Promise<AssignUserRoleResponse> {
  await gotoUsersScreen(page);
  await expectUsersScreenVisible(page);
  await openAssignmentDialog(page);
  if (roleLabel) {
    await selectDialogRole(page, roleLabel);
  }

  const roleResponsePromise = waitForRolePatchResponse(page, user);
  await submitAssignmentDialog(page);
  const roleResponse = await roleResponsePromise;

  expect(roleResponse.ok()).toBe(true);
  return (await roleResponse.json()) as AssignUserRoleResponse;
}

export function waitForRolePatchResponse(
  page: Page,
  user: UserManagementUser,
): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.url().includes(`/backoffice/users/${user.userId}/role`) &&
      response.request().method() === "PATCH",
  );
}

export function expectAssignedRoleResponse(
  actual: AssignUserRoleResponse,
  user: UserManagementUser,
  expected: {
    readonly role: UserManagementAssignableRole;
    readonly capabilities: readonly UserManagementCapability[];
  },
): void {
  expect(actual).toEqual({
    userId: user.userId,
    roles: ["customer", expected.role],
    backofficeAccess: {
      capabilities: expected.capabilities,
    },
  });
}
