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

  test("FTS-003-003 invalid working hours", async ({ page }) => {
    const saveRequests = trackSlotSettingsSaveRequests(page);

    await page.goto("/settings");
    await expect(
      page.getByRole("heading", { exact: true, name: "Настройки" }),
    ).toBeVisible();
    const currentSettings = await readSettingsForm(page);

    await page.locator("#slot-settings-open").fill("18:00");
    await page.locator("#slot-settings-close").fill("18:00");

    await expect(
      page.getByText("Время закрытия должно быть позже времени открытия."),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Сохранить" }),
    ).toBeDisabled();
    await expect(page.getByText("Настройки сохранены")).toBeHidden();
    expect(saveRequests.count(), "invalid working hours save requests").toBe(0);

    await expect(page.locator("#slot-settings-open")).toHaveValue("18:00");
    await expect(page.locator("#slot-settings-close")).toHaveValue("18:00");
    await page.locator("#slot-settings-close").fill("19:00");
    await expect(
      page.getByText("Время закрытия должно быть позже времени открытия."),
    ).toBeHidden();
    await expect(page.getByRole("button", { name: "Сохранить" })).toBeEnabled();

    await page.reload();
    await expect(page.locator("#slot-settings-open")).toHaveValue(
      currentSettings.workingHoursOpen,
    );
    await expect(page.locator("#slot-settings-close")).toHaveValue(
      currentSettings.workingHoursClose,
    );
  });

  test("FTS-003-004 invalid slot capacity", async ({ page }) => {
    const saveRequests = trackSlotSettingsSaveRequests(page);

    await page.goto("/settings");
    await expect(
      page.getByRole("heading", { exact: true, name: "Настройки" }),
    ).toBeVisible();
    const currentSettings = await readSettingsForm(page);

    await page.locator("#slot-settings-capacity").fill("0");

    await expect(page.getByText("Введите целое число больше 0.")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Сохранить" }),
    ).toBeDisabled();
    await expect(page.getByText("Настройки сохранены")).toBeHidden();
    expect(saveRequests.count(), "invalid slot capacity save requests").toBe(0);

    await page.reload();
    await expect(page.locator("#slot-settings-capacity")).toHaveValue(
      String(currentSettings.slotCapacity),
    );
  });

  test("FTS-003-005 settings access guard", async ({ page }) => {
    await mockBaristaSession(page);

    await page.goto("/");
    await expect(page.getByText("Бариста")).toBeVisible();
    await expect(page.getByRole("link", { name: /Заказы/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Доступность/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Настройки/ })).toHaveCount(0);

    await page.goto("/settings");
    await expect(page.getByText("403")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Доступ к этой вкладке запрещён" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { exact: true, name: "Настройки" }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Сохранить" })).toHaveCount(
      0,
    );
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

async function readSettingsForm(page: Page): Promise<SlotSettingsSnapshot> {
  return {
    workingHoursOpen: await page.locator("#slot-settings-open").inputValue(),
    workingHoursClose: await page.locator("#slot-settings-close").inputValue(),
    slotCapacity: Number.parseInt(
      await page.locator("#slot-settings-capacity").inputValue(),
      10,
    ),
  };
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

function trackSlotSettingsSaveRequests(page: Page): { count: () => number } {
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

async function mockBaristaSession(page: Page): Promise<void> {
  await page.route("**/backoffice/auth/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        userId: "e2e-barista",
        telegramId: "2002",
        roles: ["barista"],
        capabilities: ["orders", "availability"],
      }),
    });
  });
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
