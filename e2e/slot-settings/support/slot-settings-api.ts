import { expect, type APIRequestContext } from "@playwright/test";

import type {
  AvailableSlot,
  SlotSettingsSnapshot,
} from "./slot-settings-types";

const ADMIN_TELEGRAM_ID = process.env.E2E_TEST_TELEGRAM_ID ?? "123456789";

export const DEFAULT_SETTINGS: SlotSettingsSnapshot = {
  workingHoursOpen: "09:00",
  workingHoursClose: "20:00",
  slotCapacity: 5,
};

export async function saveSettingsViaApi(
  request: APIRequestContext,
  settings: SlotSettingsSnapshot,
): Promise<void> {
  const response = await request.put(
    apiUrl("/backoffice/settings/slot-settings"),
    {
      data: settings,
      headers: {
        ...authHeaders(),
        "content-type": "application/json",
      },
    },
  );

  await response.dispose();
}

export async function getCustomerSlots(
  request: APIRequestContext,
): Promise<readonly AvailableSlot[]> {
  const response = await request.get(apiUrl("/customer/slots"));

  expect(response.ok()).toBe(true);
  return (await response.json()) as readonly AvailableSlot[];
}

export function apiUrl(path: string): string {
  const backendBaseUrl = process.env.E2E_BACKEND_BASE_URL?.replace(/\/$/, "");
  if (!backendBaseUrl) {
    return path;
  }

  return `${backendBaseUrl}${path}`;
}

export function authHeaders(): Record<string, string> {
  return { "x-test-telegram-id": ADMIN_TELEGRAM_ID };
}
