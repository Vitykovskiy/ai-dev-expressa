import { expect, test } from "@playwright/test";

const TEST_TELEGRAM_ID = process.env.E2E_TEST_TELEGRAM_ID ?? "123456789";

test("published backoffice serves menu and test-mode API", async ({
  page,
  request,
}) => {
  const orders = await request.get("/backoffice/orders", {
    headers: { "x-test-telegram-id": TEST_TELEGRAM_ID },
  });
  expect(orders.ok()).toBe(true);

  await page.goto("/menu");
  await expect(
    page.getByRole("heading", { exact: true, name: "Меню" }),
  ).toBeVisible();
});
