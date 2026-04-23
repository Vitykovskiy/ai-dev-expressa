import { expect, test } from "@playwright/test";

import { apiPost, expectJsonMessage } from "./support/menu-catalog-api";

const NON_MENU_TELEGRAM_ID = "2002";

test.describe("administrator menu catalog API contract", () => {
  test("invalid option group rule is rejected by menu catalog contract", async ({
    request,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-002-011"]);
    const response = await apiPost(request, "/backoffice/menu/option-groups", {
      name: `Bad option group ${Date.now()}`,
      selectionMode: "unsupported",
      options: [],
    });

    expect(response.status()).toBe(400);
    await expectJsonMessage(response, "invalid-option-group-rule");
  });

  test("direct menu API access is denied when menu access is unavailable", async ({
    request,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-002-007"]);
    const response = await request.get("/backoffice/menu/catalog", {
      headers: { "x-test-telegram-id": NON_MENU_TELEGRAM_ID },
    });

    expect(response.status()).toBe(403);
    await expectJsonMessage(
      response,
      /backoffice-(capability-forbidden|user-not-found)/,
    );
  });
});

function annotateScenarioIds(
  testInfo: { annotations: { type: string; description?: string }[] },
  scenarioIds: readonly string[],
): void {
  for (const scenarioId of scenarioIds) {
    testInfo.annotations.push({ type: "scenario", description: scenarioId });
  }
}
