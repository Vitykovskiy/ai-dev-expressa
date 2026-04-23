import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

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

export async function expectHiddenTabs(
  page: Page,
  tabs: readonly string[],
): Promise<void> {
  for (const tab of tabs) {
    await expect(page.getByRole("link", { name: tab })).toHaveCount(0);
  }
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

export function forbiddenHeading(page: Page): Locator {
  return page.getByRole("heading", {
    name: "Доступ к этой вкладке запрещён",
  });
}
