import { expect, type APIRequestContext } from "@playwright/test";

import type { MenuCatalogSnapshot } from "./menu-catalog-types";

const ADMIN_TELEGRAM_ID = process.env.E2E_TEST_TELEGRAM_ID ?? "123456789";

export async function getCatalog(
  request: APIRequestContext,
): Promise<MenuCatalogSnapshot> {
  const response = await request.get("/backoffice/menu/catalog", {
    headers: authHeaders(),
  });
  expect(response.ok()).toBe(true);
  return (await response.json()) as MenuCatalogSnapshot;
}

export async function apiPost(
  request: APIRequestContext,
  path: string,
  body: unknown,
) {
  return request.post(path, {
    headers: {
      ...authHeaders(),
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
