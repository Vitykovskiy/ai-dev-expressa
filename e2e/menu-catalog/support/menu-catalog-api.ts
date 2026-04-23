import { expect, type APIRequestContext } from "@playwright/test";

import type { MenuCatalogSnapshot } from "./menu-catalog-types";

const ADMIN_TELEGRAM_ID = process.env.E2E_TEST_TELEGRAM_ID ?? "1001";
const authenticatedRequests = new WeakSet<APIRequestContext>();

export async function getCatalog(
  request: APIRequestContext,
): Promise<MenuCatalogSnapshot> {
  await ensureAdministratorSession(request);
  const response = await request.get("/backoffice/menu/catalog", {});
  expect(response.ok()).toBe(true);
  return (await response.json()) as MenuCatalogSnapshot;
}

export async function apiPost(
  request: APIRequestContext,
  path: string,
  body: unknown,
) {
  await ensureAdministratorSession(request);
  return request.post(path, {
    headers: {
      "content-type": "application/json",
    },
    data: body,
  });
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

export function authHeaders(): Record<string, string> {
  return { "x-test-telegram-id": ADMIN_TELEGRAM_ID };
}

async function ensureAdministratorSession(
  request: APIRequestContext,
): Promise<void> {
  if (authenticatedRequests.has(request)) {
    return;
  }

  const response = await request.post("/backoffice/auth/session", {
    headers: { "content-type": "application/json" },
    data: process.env.E2E_TEST_TELEGRAM_ID
      ? { testTelegramId: ADMIN_TELEGRAM_ID }
      : {},
  });

  expect(response.ok()).toBe(true);
  authenticatedRequests.add(request);
}
