import { test } from "@playwright/test";

import {
  annotateScenarioIds,
  expectEntryDenied,
  mockSessionBootstrap,
} from "./support/access-helpers";

test.describe("administrator access denial coverage", () => {
  test("FTS-001-005 missing Telegram entry resolves to entry-denied", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-005"]);

    await mockSessionBootstrap(page, () => ({
      status: 401,
      code: "telegram-init-data-required",
    }));

    await page.goto("/");

    await expectEntryDenied(page, "telegram-init-data-required");
  });

  test("FTS-001-005 invalid Telegram entry resolves to entry-denied", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-005"]);

    await mockSessionBootstrap(page, () => ({
      status: 401,
      code: "telegram-hash-invalid",
    }));

    await page.goto("/");

    await expectEntryDenied(page, "telegram-hash-invalid");
  });

  test("FTS-001-006 blocked user cannot reach the working shell", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-006"]);

    await mockSessionBootstrap(page, () => ({
      status: 403,
      code: "user-blocked",
    }));

    await page.goto("/");

    await expectEntryDenied(page, "user-blocked");
  });

  test("FTS-001-006 roleless user cannot reach the working shell", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-006"]);

    await mockSessionBootstrap(page, () => ({
      status: 403,
      code: "backoffice-capability-forbidden",
    }));

    await page.goto("/");

    await expectEntryDenied(page, "backoffice-capability-forbidden");
  });
});
