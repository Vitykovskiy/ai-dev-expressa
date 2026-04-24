import {
  expect,
  type APIRequestContext,
  type APIResponse,
  type Page,
} from "@playwright/test";

import {
  bootstrapAdministratorTelegramId,
  ordinaryAdministratorTelegramId,
} from "./user-management-fixtures";
import type {
  AssignUserRoleRequest,
  AssignUserRoleResponse,
  ReadUsersListParams,
  UserManagementListResponse,
} from "./user-management-types";

const authenticatedRequests = new WeakMap<APIRequestContext, Set<string>>();

export async function getUsers(
  request: APIRequestContext,
  params: ReadUsersListParams = {},
  telegramId = bootstrapAdministratorTelegramId,
): Promise<UserManagementListResponse> {
  await ensureUserManagementSession(request, telegramId);
  const response = await request.get(
    apiUrl(`/backoffice/users${query(params)}`),
    {
      headers: authHeaders(telegramId),
    },
  );

  expect(response.ok()).toBe(true);
  return (await response.json()) as UserManagementListResponse;
}

export async function assignUserRole(
  request: APIRequestContext,
  userId: string,
  body: AssignUserRoleRequest,
  telegramId = bootstrapAdministratorTelegramId,
): Promise<AssignUserRoleResponse> {
  await ensureUserManagementSession(request, telegramId);
  const response = await patchUserRole(request, userId, body, telegramId);

  expect(response.ok()).toBe(true);
  return (await response.json()) as AssignUserRoleResponse;
}

export async function patchUserRole(
  request: APIRequestContext,
  userId: string,
  body: unknown,
  telegramId = bootstrapAdministratorTelegramId,
): Promise<APIResponse> {
  return request.patch(
    apiUrl(`/backoffice/users/${encodeURIComponent(userId)}/role`),
    {
      headers: {
        ...authHeaders(telegramId),
        "content-type": "application/json",
      },
      data: body,
    },
  );
}

export async function patchUserRoleFromBrowser(
  page: Page,
  userId: string,
  body: unknown,
  telegramId = bootstrapAdministratorTelegramId,
): Promise<{ status: number; body: { readonly message?: string } }> {
  return page.evaluate(
    async ({ targetUserId, requestBody, testTelegramId }) => {
      const response = await fetch(`/backoffice/users/${targetUserId}/role`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-test-telegram-id": testTelegramId,
        },
        body: JSON.stringify(requestBody),
      });

      return {
        status: response.status,
        body: (await response.json()) as { message?: string },
      };
    },
    {
      targetUserId: userId,
      requestBody: body,
      testTelegramId: telegramId,
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

export function authHeaders(
  telegramId = bootstrapAdministratorTelegramId,
): Record<string, string> {
  return { "x-test-telegram-id": telegramId };
}

export async function ensureBootstrapAdministratorSession(
  request: APIRequestContext,
): Promise<void> {
  await ensureUserManagementSession(request, bootstrapAdministratorTelegramId);
}

export async function ensureOrdinaryAdministratorSession(
  request: APIRequestContext,
): Promise<void> {
  await ensureUserManagementSession(request, ordinaryAdministratorTelegramId);
}

export async function ensureUserManagementSession(
  request: APIRequestContext,
  telegramId = bootstrapAdministratorTelegramId,
): Promise<void> {
  const authenticatedIds =
    authenticatedRequests.get(request) ?? new Set<string>();
  if (authenticatedIds.has(telegramId)) {
    return;
  }

  const response = await request.post(apiUrl("/backoffice/auth/session"), {
    headers: { "content-type": "application/json" },
    data: { testTelegramId: telegramId },
  });

  expect(response.ok()).toBe(true);
  authenticatedIds.add(telegramId);
  authenticatedRequests.set(request, authenticatedIds);
}

export function apiUrl(path: string): string {
  const backendBaseUrl = process.env.E2E_BACKEND_BASE_URL?.replace(/\/$/, "");
  if (!backendBaseUrl) {
    return path;
  }

  return `${backendBaseUrl}${path}`;
}

function query(params: ReadUsersListParams): string {
  const search = new URLSearchParams();
  if (params.search) {
    search.set("search", params.search);
  }

  if (params.role) {
    search.set("role", params.role);
  }

  if (typeof params.blocked === "boolean") {
    search.set("blocked", String(params.blocked));
  }

  const value = search.toString();
  return value ? `?${value}` : "";
}
