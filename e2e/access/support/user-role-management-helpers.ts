import { expect, type Page, type Route } from "@playwright/test";

import type { AccessActor, ManagedUser } from "./access-helpers";

export const ADMINISTRATOR_CAPABILITIES = [
  "orders",
  "availability",
  "menu",
  "users",
  "settings",
] as const;

export const BARISTA_CAPABILITIES = ["orders", "availability"] as const;

export const targetCustomer: ManagedUser = {
  userId: "f004-target-customer",
  telegramId: "94004001",
  roles: ["customer"],
  blocked: false,
  capabilities: [],
  displayLabel: "F004 Target Customer",
};

export const ordinaryAdministratorActor: AccessActor = {
  userId: "f004-ordinary-admin",
  telegramId: "94004002",
  roles: ["administrator"],
  capabilities: ADMINISTRATOR_CAPABILITIES,
};

export const mainAdministratorActor: AccessActor = {
  userId: "f004-main-admin",
  telegramId: "1",
  roles: ["administrator"],
  capabilities: ADMINISTRATOR_CAPABILITIES,
};

export async function mockUsersList(
  page: Page,
  users: () => readonly ManagedUser[],
): Promise<void> {
  await page.route("**/backoffice/user-management/users", async (route) => {
    await fulfillJson(route, 200, { users: users() });
  });
}

export async function openAssignRoleDialog(page: Page): Promise<void> {
  await page.locator('button[title="Действия пользователя"]').first().click();
  await page.getByText("Назначить роль", { exact: true }).first().click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Назначить роль" }),
  ).toBeVisible();
}

export async function chooseRoleAndSubmit(
  page: Page,
  role: "barista" | "administrator",
): Promise<void> {
  await page.locator(`input[type="radio"][value="${role}"]`).check({
    force: true,
  });
  await page
    .getByRole("button", { exact: true, name: "Назначить роль" })
    .click();
}

export async function fulfillJson(
  route: Route,
  status: number,
  body: unknown,
): Promise<void> {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

export function targetUserIdFromRoute(route: Route): string | undefined {
  const pathname = new URL(route.request().url()).pathname;
  return pathname.match(
    /\/backoffice\/user-management\/users\/([^/]+)\/role$/,
  )?.[1];
}
