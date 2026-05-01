import {
  expect,
  type APIRequestContext,
  type APIResponse,
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

export interface ManagedUser {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly string[];
  readonly blocked: boolean;
  readonly capabilities: readonly string[];
  readonly displayLabel?: string;
}

export interface ManagedUsersResponse {
  readonly users: readonly ManagedUser[];
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

const administratorSessionByRequest = new WeakMap<
  APIRequestContext,
  Promise<AccessActor>
>();

export function annotateScenarioIds(
  testInfo: TestInfo,
  scenarioIds: readonly string[],
): void {
  for (const scenarioId of scenarioIds) {
    testInfo.annotations.push({ type: "scenario", description: scenarioId });
  }
}

export function apiUrl(path: string): string {
  const backendBaseUrl = process.env.E2E_BACKEND_BASE_URL?.replace(/\/$/, "");
  if (!backendBaseUrl) {
    return path;
  }

  return `${backendBaseUrl}${path}`;
}

export async function getDefaultAdministratorActor(
  request: APIRequestContext,
): Promise<AccessActor> {
  const existingSession = administratorSessionByRequest.get(request);
  if (existingSession) {
    return existingSession;
  }

  const sessionPromise = request
    .post(apiUrl("/backoffice/auth/session"), {
      headers: { "content-type": "application/json" },
      data: process.env.E2E_TEST_TELEGRAM_ID
        ? { testTelegramId: process.env.E2E_TEST_TELEGRAM_ID }
        : {},
    })
    .then(async (response) => {
      expect(response.ok()).toBe(true);
      return (await response.json()) as AccessActor;
    });

  administratorSessionByRequest.set(request, sessionPromise);
  return sessionPromise;
}

export async function getManagedUsers(
  request: APIRequestContext,
  actorTelegramId?: string,
): Promise<readonly ManagedUser[]> {
  const telegramId =
    actorTelegramId ?? (await getDefaultAdministratorActor(request)).telegramId;
  const response = await request.get(
    apiUrl("/backoffice/user-management/users"),
    {
      headers: authHeaders(telegramId),
    },
  );

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ManagedUsersResponse;
  return body.users;
}

export async function assignUserRole(
  request: APIRequestContext,
  targetUserId: string,
  assignedRole: string,
  actorTelegramId?: string,
): Promise<APIResponse> {
  const telegramId =
    actorTelegramId ?? (await getDefaultAdministratorActor(request)).telegramId;
  return request.patch(
    apiUrl(`/backoffice/user-management/users/${targetUserId}/role`),
    {
      headers: {
        ...authHeaders(telegramId),
        "content-type": "application/json",
      },
      data: { assignedRole },
    },
  );
}

export async function expectJsonMessage(
  response: { json: () => Promise<unknown> },
  expected: string | RegExp,
): Promise<void> {
  const body = (await response.json()) as { readonly message?: string };
  if (expected instanceof RegExp) {
    expect(body.message).toMatch(expected);
    return;
  }

  expect(body.message).toBe(expected);
}

export function authHeaders(telegramId: string): Record<string, string> {
  return { "x-test-telegram-id": telegramId };
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
