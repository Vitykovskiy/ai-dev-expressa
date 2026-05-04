import { type Page, type Route } from "@playwright/test";

import type { AccessActor, ManagedUser } from "./access-helpers";

export const blockableTargetUser: ManagedUser = {
  userId: "f005-target-user",
  telegramId: "95005001",
  roles: ["customer", "barista"],
  blocked: false,
  capabilities: ["orders", "availability"],
  displayLabel: "F005 Target User",
};

export const nonAdministratorActor: AccessActor = {
  userId: "f005-non-admin",
  telegramId: "95005002",
  roles: ["barista"],
  capabilities: ["orders", "availability"],
};

export function targetUserIdFromBlockRoute(route: Route): string | undefined {
  const pathname = new URL(route.request().url()).pathname;
  return pathname.match(
    /\/backoffice\/user-management\/users\/([^/]+)\/block$/,
  )?.[1];
}

export async function openBlockUserAction(
  page: Page,
  telegramId: string,
): Promise<void> {
  const userRow = page
    .getByText(`@${telegramId}`, { exact: true })
    .locator('xpath=ancestor::*[.//button[@title="Действия пользователя"]][1]');

  await userRow.locator('button[title="Действия пользователя"]').click();
  await page.getByRole("listitem").filter({ hasText: "Заблокировать" }).click();
}
