import type { Page } from "@playwright/test";

import type { SlotSettingsSnapshot } from "./slot-settings-types";

export async function fillSettingsForm(
  page: Page,
  settings: SlotSettingsSnapshot,
): Promise<void> {
  await page.locator("#slot-settings-open").fill(settings.workingHoursOpen);
  await page.locator("#slot-settings-close").fill(settings.workingHoursClose);
  await page
    .locator("#slot-settings-capacity")
    .fill(String(settings.slotCapacity));
}

export async function readSettingsForm(
  page: Page,
): Promise<SlotSettingsSnapshot> {
  return {
    workingHoursOpen: await page.locator("#slot-settings-open").inputValue(),
    workingHoursClose: await page.locator("#slot-settings-close").inputValue(),
    slotCapacity: Number.parseInt(
      await page.locator("#slot-settings-capacity").inputValue(),
      10,
    ),
  };
}

export function trackSlotSettingsSaveRequests(page: Page): {
  count: () => number;
} {
  let count = 0;
  page.on("request", (request) => {
    if (
      request.url().includes("/backoffice/settings/slot-settings") &&
      request.method() === "PUT"
    ) {
      count += 1;
    }
  });

  return { count: () => count };
}
