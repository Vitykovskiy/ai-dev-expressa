import { expect, test } from "./support/slot-settings-test";
import {
  readSettingsForm,
  trackSlotSettingsSaveRequests,
} from "./support/slot-settings-ui";

test.describe("administrator slot settings validation", () => {
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
});
