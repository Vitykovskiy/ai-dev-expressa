import { expect, type Page, type TestInfo } from "@playwright/test";

export interface AccessActor {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly string[];
  readonly capabilities: readonly string[];
}

export interface AccessErrorResponse {
  readonly status: number;
  readonly code: string;
}

export interface SessionRequestPayload {
  readonly initData?: string;
  readonly testTelegramId?: string;
}

export const administratorActor: AccessActor = {
  userId: "e2e-admin",
  telegramId: "1001",
  roles: ["administrator"],
  capabilities: ["orders", "availability", "menu", "users", "settings"],
};

export const baristaActor: AccessActor = {
  userId: "e2e-barista",
  telegramId: "2002",
  roles: ["barista"],
  capabilities: ["orders", "availability"],
};

export function annotateScenarioIds(
  testInfo: TestInfo,
  scenarioIds: readonly string[],
): void {
  for (const scenarioId of scenarioIds) {
    testInfo.annotations.push({ type: "scenario", description: scenarioId });
  }
}

export async function injectTelegramInitData(
  page: Page,
  initData: string,
): Promise<void> {
  await page.addInitScript((value) => {
    const telegram = {
      WebApp: {
        initData: value,
        ready: () => undefined,
        expand: () => undefined,
      },
    };

    Object.defineProperty(window, "Telegram", {
      configurable: true,
      value: telegram,
    });
  }, initData);
}

export async function mockSessionBootstrap(
  page: Page,
  handler: (
    payload: SessionRequestPayload,
  ) =>
    | AccessActor
    | AccessErrorResponse
    | Promise<AccessActor | AccessErrorResponse>,
): Promise<void> {
  await page.route("**/backoffice/auth/session", async (route) => {
    const payload = (route.request().postDataJSON() ??
      {}) as SessionRequestPayload;
    const response = await handler(payload);

    if ("capabilities" in response) {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
      return;
    }

    await route.fulfill({
      status: response.status,
      contentType: "application/json",
      body: JSON.stringify({ message: response.code }),
    });
  });
}

export async function expectVisibleTabs(
  page: Page,
  tabs: readonly string[],
): Promise<void> {
  for (const tab of tabs) {
    await expect(page.getByRole("link", { name: tab })).toBeVisible();
  }
}

export async function expectHiddenTabs(
  page: Page,
  tabs: readonly string[],
): Promise<void> {
  for (const tab of tabs) {
    await expect(page.getByRole("link", { name: tab })).toHaveCount(0);
  }
}

export async function expectEntryDenied(
  page: Page,
  reason: string,
): Promise<void> {
  await expect(
    page.getByRole("heading", { name: "Вход в backoffice недоступен" }),
  ).toBeVisible();
  await expect(page.getByText(`Причина: ${reason}`)).toBeVisible();
  await expect(
    page.getByRole("heading", { exact: true, name: "Заказы" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).toHaveCount(0);
}
