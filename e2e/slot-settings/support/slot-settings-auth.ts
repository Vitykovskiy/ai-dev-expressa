import type { Page } from "@playwright/test";

export async function mockBaristaSession(page: Page): Promise<void> {
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
