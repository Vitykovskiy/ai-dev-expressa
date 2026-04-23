import {
  expect,
  type APIRequestContext,
  type Page,
  test,
} from "@playwright/test";

const ADMIN_TELEGRAM_ID = process.env.E2E_TEST_TELEGRAM_ID ?? "123456789";
const DEFAULT_SETTINGS: SlotSettingsSnapshot = {
  workingHoursOpen: "09:00",
  workingHoursClose: "20:00",
  slotCapacity: 5,
};

test.describe("administrator slot settings management", () => {
  test.afterEach(async ({ request }) => {
    await saveSettingsViaApi(request, DEFAULT_SETTINGS);
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
    test.skip(
      !process.env.E2E_BACKEND_BASE_URL,
      "E2E_BACKEND_BASE_URL is required to query /customer/slots as JSON.",
    );

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

async function fillSettingsForm(
  page: Page,
  settings: SlotSettingsSnapshot,
): Promise<void> {
  await page.locator("#slot-settings-open").fill(settings.workingHoursOpen);
  await page.locator("#slot-settings-close").fill(settings.workingHoursClose);
  await page
    .locator("#slot-settings-capacity")
    .fill(String(settings.slotCapacity));
}

async function saveSettingsViaApi(
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

async function getCustomerSlots(
  request: APIRequestContext,
): Promise<readonly AvailableSlot[]> {
  const response = await request.get(apiUrl("/customer/slots"));

  expect(response.ok()).toBe(true);
  return (await response.json()) as readonly AvailableSlot[];
}

function apiUrl(path: string): string {
  const backendBaseUrl = process.env.E2E_BACKEND_BASE_URL?.replace(/\/$/, "");
  if (!backendBaseUrl) {
    return path;
  }

  return `${backendBaseUrl}${path}`;
}

function authHeaders(): Record<string, string> {
  return { "x-test-telegram-id": ADMIN_TELEGRAM_ID };
}

function minutesBetween(start: string, end: string): number {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  return endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
}

interface SlotSettingsSnapshot {
  readonly workingHoursOpen: string;
  readonly workingHoursClose: string;
  readonly slotCapacity: number;
}

interface AvailableSlot {
  readonly date: string;
  readonly slotStart: string;
  readonly slotEnd: string;
  readonly capacityLimit: number;
  readonly activeOrderCount: number;
}
