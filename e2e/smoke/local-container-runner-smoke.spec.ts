import { expect, test } from "@playwright/test";

test("local container runner serves backend and backoffice", async ({
  page,
  request,
}) => {
  const backendBaseUrl =
    process.env.E2E_BACKEND_BASE_URL ?? "http://127.0.0.1:3000";

  const health = await request.get(`${backendBaseUrl}/health`);
  expect(health.ok()).toBe(true);

  await page.goto("/menu");
  await expect(
    page.getByRole("heading", { exact: true, name: "Меню" }),
  ).toBeVisible();
});
