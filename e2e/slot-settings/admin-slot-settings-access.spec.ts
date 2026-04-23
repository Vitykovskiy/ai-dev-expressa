import { mockBaristaSession } from "./support/slot-settings-auth";
import { expect, test } from "./support/slot-settings-test";

test.describe("administrator slot settings access", () => {
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
