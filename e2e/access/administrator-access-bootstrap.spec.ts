import { expect, test } from "@playwright/test";

import {
  administratorActor,
  annotateScenarioIds,
  expectEntryDenied,
  expectVisibleTabs,
  injectTelegramInitData,
  mockSessionBootstrap,
  type AccessActor,
} from "./support/access-helpers";

test.describe("administrator access bootstrap coverage", () => {
  test("FTS-001-001 Telegram bootstrap creates administrator session", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-001"]);

    let bootstrapPayload:
      | {
          readonly initData?: string;
          readonly testTelegramId?: string;
        }
      | undefined;
    let releaseBootstrap: (() => void) | undefined;

    const bootstrapReleased = new Promise<void>((resolve) => {
      releaseBootstrap = resolve;
    });

    await injectTelegramInitData(page, "query_id=telegram-e2e&hash=signed");
    await mockSessionBootstrap(page, async (payload) => {
      bootstrapPayload = payload;
      await bootstrapReleased;
      return administratorActor;
    });

    const navigation = page.getByRole("navigation", {
      name: "Основная навигация",
    });
    const bootstrapResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/backoffice/auth/session") &&
        response.request().method() === "POST",
    );

    await page.goto("/");
    await expect(navigation).toHaveCount(0);

    releaseBootstrap?.();

    const bootstrapResponse = await bootstrapResponsePromise;
    expect(bootstrapPayload).toMatchObject({
      initData: "query_id=telegram-e2e&hash=signed",
    });
    expect(bootstrapPayload?.testTelegramId).toBeFalsy();
    expect(bootstrapResponse.status()).toBe(201);
    await expect(bootstrapResponse.json()).resolves.toMatchObject({
      roles: ["administrator"],
      capabilities: administratorActor.capabilities,
    } satisfies Partial<AccessActor>);

    await expect(page.getByText("Администратор")).toBeVisible();
    await expectVisibleTabs(page, [
      "Заказы",
      "Доступность",
      "Меню",
      "Пользователи",
      "Настройки",
    ]);
    await expect(
      page.getByRole("heading", { exact: true, name: "Заказы" }),
    ).toBeVisible();
  });

  test("FTS-001-002 test-mode bootstrap succeeds in test environment", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-002"]);

    let bootstrapPayload:
      | {
          readonly initData?: string;
          readonly testTelegramId?: string;
        }
      | undefined;

    const bootstrapResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/backoffice/auth/session") &&
        response.request().method() === "POST",
    );

    await page.route("**/backoffice/auth/session", async (route) => {
      bootstrapPayload = (route.request().postDataJSON() ?? {}) as {
        readonly initData?: string;
        readonly testTelegramId?: string;
      };
      await route.continue();
    });

    await page.goto("/");

    const bootstrapResponse = await bootstrapResponsePromise;
    expect(bootstrapPayload?.initData).toBeFalsy();
    expect(bootstrapResponse.status()).toBe(201);
    await expect(bootstrapResponse.json()).resolves.toMatchObject({
      roles: ["administrator"],
      capabilities: administratorActor.capabilities,
    } satisfies Partial<AccessActor>);

    await expect(page.getByText("Администратор")).toBeVisible();
    await expectVisibleTabs(page, [
      "Заказы",
      "Доступность",
      "Меню",
      "Пользователи",
      "Настройки",
    ]);
  });

  test("FTS-001-002 production-like bootstrap rejection resolves to entry-denied", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-002"]);

    await mockSessionBootstrap(page, () => ({
      status: 401,
      code: "telegram-init-data-required",
    }));

    await page.goto("/");

    await expectEntryDenied(page, "telegram-init-data-required");
  });

  test("FTS-001-007 repeated bootstrap preserves the same authenticated actor", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FTS-001-007"]);

    const bootstrapBodies: AccessActor[] = [];

    page.on("response", async (response) => {
      if (
        response.url().endsWith("/backoffice/auth/session") &&
        response.request().method() === "POST" &&
        response.status() === 201
      ) {
        bootstrapBodies.push((await response.json()) as AccessActor);
      }
    });

    await page.goto("/");
    await expect(page.getByText("Администратор")).toBeVisible();

    await page.reload();
    await expect(page.getByText("Администратор")).toBeVisible();

    await expect
      .poll(() => bootstrapBodies.length, {
        message: "expected two successful bootstrap responses",
      })
      .toBeGreaterThanOrEqual(2);

    expect(bootstrapBodies[0]?.telegramId).toBe(bootstrapBodies[1]?.telegramId);
    expect(bootstrapBodies[0]?.userId).toBe(bootstrapBodies[1]?.userId);
    expect(bootstrapBodies[0]?.capabilities).toEqual(
      bootstrapBodies[1]?.capabilities,
    );
  });
});
