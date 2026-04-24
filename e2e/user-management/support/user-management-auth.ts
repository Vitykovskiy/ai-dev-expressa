import { type Page, type TestInfo } from "@playwright/test";

import type {
  UserManagementActor,
  UserManagementErrorResponse,
  UserManagementSessionPayload,
} from "./user-management-types";

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

export async function mockUserManagementSession(
  page: Page,
  handler: (
    payload: UserManagementSessionPayload,
  ) =>
    | UserManagementActor
    | UserManagementErrorResponse
    | Promise<UserManagementActor | UserManagementErrorResponse>,
): Promise<void> {
  await page.route("**/backoffice/auth/session", async (route) => {
    const payload = (route.request().postDataJSON() ??
      {}) as UserManagementSessionPayload;
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
