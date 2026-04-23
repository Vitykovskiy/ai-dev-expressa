import {
  DEFAULT_SETTINGS,
  getCustomerSlots,
  saveSettingsViaApi,
} from "./support/slot-settings-api";
import { expect, test } from "./support/slot-settings-test";
import { fillSettingsForm, readSettingsForm } from "./support/slot-settings-ui";
import { minutesBetween } from "./support/slot-settings-utils";
import type { SlotSettingsSnapshot } from "./support/slot-settings-types";

test.describe("administrator slot settings management", () => {
  test.afterEach(async ({ request }) => {
    await saveSettingsViaApi(request, DEFAULT_SETTINGS);
  });

  test("FTS-003-002 partial settings update", async ({ page }) => {
    await page.goto("/settings");
    await expect(
      page.getByRole("heading", { exact: true, name: "Настройки" }),
    ).toBeVisible();
    const initialSettings = await readSettingsForm(page);
    const updatedCapacity =
      initialSettings.slotCapacity >= 9
        ? initialSettings.slotCapacity - 1
        : initialSettings.slotCapacity + 1;

    await page.locator("#slot-settings-capacity").fill(String(updatedCapacity));

    const saveResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/backoffice/settings/slot-settings") &&
        response.request().method() === "PUT",
    );
    await page.getByRole("button", { name: "Сохранить" }).click();
    const saveResponse = await saveResponsePromise;

    expect(saveResponse.ok(), "successful partial save operation").toBe(true);
    await expect(page.getByText("Настройки сохранены")).toBeVisible();

    await page.reload();
    await expect(page.locator("#slot-settings-open")).toHaveValue(
      initialSettings.workingHoursOpen,
    );
    await expect(page.locator("#slot-settings-close")).toHaveValue(
      initialSettings.workingHoursClose,
    );
    await expect(page.locator("#slot-settings-capacity")).toHaveValue(
      String(updatedCapacity),
    );
  });

  test("FTS-003-001 administrator saves slot settings", async ({
    page,
    request,
  }) => {
    const settings: SlotSettingsSnapshot = {
      workingHoursOpen: "08:00",
      workingHoursClose: "18:00",
      slotCapacity: 6,
    };

    await page.goto("/settings");
    await expect(
      page.getByRole("heading", { exact: true, name: "Настройки" }),
    ).toBeVisible();

    await fillSettingsForm(page, settings);

    const saveResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/backoffice/settings/slot-settings") &&
        response.request().method() === "PUT",
    );
    await page.getByRole("button", { name: "Сохранить" }).click();
    const saveResponse = await saveResponsePromise;

    expect(saveResponse.ok(), "successful save operation").toBe(true);
    await expect(page.getByText("Настройки сохранены")).toBeVisible();

    await page.reload();
    await expect(page.locator("#slot-settings-open")).toHaveValue(
      settings.workingHoursOpen,
    );
    await expect(page.locator("#slot-settings-close")).toHaveValue(
      settings.workingHoursClose,
    );
    await expect(page.locator("#slot-settings-capacity")).toHaveValue(
      String(settings.slotCapacity),
    );
  });

  test("FTS-003-006 settings affect slot generation", async ({
    page,
    request,
  }) => {
    const settings: SlotSettingsSnapshot = {
      workingHoursOpen: "10:00",
      workingHoursClose: "10:30",
      slotCapacity: 7,
    };

    await page.goto("/settings");
    await expect(
      page.getByRole("heading", { exact: true, name: "Настройки" }),
    ).toBeVisible();

    await fillSettingsForm(page, settings);
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/backoffice/settings/slot-settings") &&
          response.request().method() === "PUT" &&
          response.ok(),
      ),
      page.getByRole("button", { name: "Сохранить" }).click(),
    ]);
    await expect(page.getByText("Настройки сохранены")).toBeVisible();

    const slots = await getCustomerSlots(request);
    const today = new Date().toISOString().slice(0, 10);

    expect(slots).toEqual([
      {
        date: today,
        slotStart: "10:00",
        slotEnd: "10:10",
        capacityLimit: settings.slotCapacity,
        activeOrderCount: 0,
      },
      {
        date: today,
        slotStart: "10:10",
        slotEnd: "10:20",
        capacityLimit: settings.slotCapacity,
        activeOrderCount: 0,
      },
      {
        date: today,
        slotStart: "10:20",
        slotEnd: "10:30",
        capacityLimit: settings.slotCapacity,
        activeOrderCount: 0,
      },
    ]);

    for (const slot of slots) {
      expect(minutesBetween(slot.slotStart, slot.slotEnd)).toBe(10);
      expect(slot.date).toBe(today);
      expect(slot.capacityLimit).toBe(settings.slotCapacity);
    }
  });
});
