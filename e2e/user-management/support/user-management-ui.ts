import { expect, type Locator, type Page } from "@playwright/test";

export const usersRoute = "/users";

export async function gotoUsersScreen(page: Page): Promise<void> {
  await page.goto(usersRoute);
}

export async function expectUsersScreenVisible(page: Page): Promise<void> {
  await expect(
    page.getByRole("heading", { exact: true, name: "Пользователи" }),
  ).toBeVisible();
}

export async function expectUserRow(
  page: Page,
  input: {
    readonly displayName: string;
    readonly telegramUsername: string;
  },
): Promise<Locator> {
  const row = userRow(page, input.displayName);
  await expect(row).toBeVisible();
  await expect(
    row.getByText(input.telegramUsername, { exact: true }),
  ).toBeVisible();
  return row;
}

export async function openAssignmentDialog(
  page: Page,
  userDisplayName?: string,
): Promise<void> {
  if (userDisplayName) {
    await userRow(page, userDisplayName)
      .getByTitle("Действия пользователя")
      .click();
    await page.getByRole("menuitem", { name: "Назначить роль" }).click();
  } else {
    await page.getByRole("button", { name: "Добавить пользователя" }).click();
  }

  await expect(
    page.getByRole("heading", { name: "Новый пользователь" }),
  ).toBeVisible();
}

export async function selectDialogUser(
  page: Page,
  optionName: string,
): Promise<void> {
  await selectOption(
    page,
    page.getByRole("combobox", { name: "Пользователь" }),
    optionName,
  );
}

export async function selectDialogRole(
  page: Page,
  roleLabel: string,
): Promise<void> {
  await selectOption(
    page,
    page.getByRole("combobox", { name: "Роль" }),
    roleLabel,
  );
}

export async function submitAssignmentDialog(page: Page): Promise<void> {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Добавить пользователя" })
    .click();
}

export async function expectForbiddenScreen(page: Page): Promise<void> {
  await expect(page).toHaveURL(/\/forbidden(?:\?.*)?$/);
  await expect(page.getByText("403", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Доступ к этой вкладке запрещён",
    }),
  ).toBeVisible();
}

export async function expectHiddenTabs(
  page: Page,
  tabs: readonly string[],
): Promise<void> {
  for (const tab of tabs) {
    await expect(page.getByRole("link", { name: tab })).toHaveCount(0);
  }
}

export async function expectVisibleTabs(
  page: Page,
  tabs: readonly string[],
): Promise<void> {
  for (const tab of tabs) {
    await expect(page.getByRole("link", { name: tab })).toBeVisible();
  }
}

export function userRow(page: Page, displayName: string): Locator {
  return page.locator(".user-row").filter({
    has: page.getByText(displayName, { exact: true }),
  });
}

async function selectOption(
  page: Page,
  field: Locator,
  optionName: string,
): Promise<void> {
  await field
    .locator("xpath=ancestor::div[contains(@class, 'v-field')][1]")
    .click();
  await page.getByRole("option", { name: optionName }).click();
}
