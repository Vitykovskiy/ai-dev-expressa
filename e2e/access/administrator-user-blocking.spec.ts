import { expect, test } from "@playwright/test";

import {
  administratorActor,
  annotateScenarioIds,
  expectEntryDenied,
  mockSessionBootstrap,
  type ManagedUser,
} from "./support/access-helpers";
import {
  fulfillJson,
  mockUsersList,
} from "./support/user-role-management-helpers";
import {
  blockableTargetUser,
  nonAdministratorActor,
  openBlockUserAction,
  targetUserIdFromBlockRoute,
} from "./support/user-blocking-helpers";

test.describe("administrator user blocking", () => {
  test("FEATURE-005-SC-001 administrator blocks existing user", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FEATURE-005-SC-001"]);

    let users: readonly ManagedUser[] = [blockableTargetUser];
    let blockRequestBody: string | null = null;

    await mockSessionBootstrap(page, () => administratorActor);
    await mockUsersList(page, () => users);
    await page.route(
      "**/backoffice/user-management/users/*/block",
      async (route) => {
        blockRequestBody = route.request().postData();
        expect(targetUserIdFromBlockRoute(route)).toBe(
          blockableTargetUser.userId,
        );

        const blockedUser: ManagedUser = {
          ...blockableTargetUser,
          blocked: true,
        };
        users = [blockedUser];

        await fulfillJson(route, 200, { user: blockedUser });
      },
    );

    await page.goto("/users");
    await expect(page.getByText("@95005001", { exact: true })).toBeVisible();
    await expect(page.getByText("Активен", { exact: true })).toBeVisible();

    const blockResponsePromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/backoffice/user-management/users/${blockableTargetUser.userId}/block`,
          ) && response.request().method() === "PATCH",
    );

    await openBlockUserAction(page, blockableTargetUser.telegramId);
    const blockResponse = await blockResponsePromise;
    const blockBody = (await blockResponse.json()) as {
      readonly user: ManagedUser;
    };

    expect(blockResponse.status()).toBe(200);
    expect(blockRequestBody).toBeNull();
    expect(blockBody.user.blocked).toBe(true);
    await expect(page.getByText("Заблокирован", { exact: true })).toBeVisible();
    await expect(page.getByText("Активен", { exact: true })).toHaveCount(0);
  });

  test("FEATURE-005-SC-002 blocked user loses application access", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FEATURE-005-SC-002"]);

    let sessionResult:
      | typeof administratorActor
      | { readonly status: number; readonly code: string } = {
      status: 403,
      code: "user-blocked",
    };

    await mockSessionBootstrap(page, () => sessionResult);
    await mockUsersList(page, () => [blockableTargetUser]);

    await page.goto("/");

    await expectEntryDenied(page, "user-blocked");

    sessionResult = administratorActor;
    await page.goto("/users");

    await expect(
      page.getByRole("heading", { exact: true, name: "Пользователи" }),
    ).toBeVisible();
    await expect(page.getByText("@95005001", { exact: true })).toBeVisible();
  });

  test("FEATURE-005-SC-003 non-administrator cannot block user", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["FEATURE-005-SC-003"]);

    let users: readonly ManagedUser[] = [blockableTargetUser];
    let blockAttempted = false;

    await mockSessionBootstrap(page, () => nonAdministratorActor);
    await page.route(
      "**/backoffice/user-management/users/*/block",
      async (route) => {
        blockAttempted = true;
        expect(targetUserIdFromBlockRoute(route)).toBe(
          blockableTargetUser.userId,
        );

        await fulfillJson(route, 403, {
          message: "administrator-role-required",
          error: "Forbidden",
          statusCode: 403,
        });
      },
    );

    await page.goto("/");

    const operationResult = await page.evaluate(async (targetUserId) => {
      const response = await fetch(
        `/backoffice/user-management/users/${targetUserId}/block`,
        {
          method: "PATCH",
          headers: {
            "x-test-telegram-id": "95005002",
          },
        },
      );

      return {
        body: (await response.json()) as { readonly message?: string },
        status: response.status,
      };
    }, blockableTargetUser.userId);

    users = users.map((user) =>
      user.userId === blockableTargetUser.userId ? { ...user } : user,
    );

    expect(blockAttempted).toBe(true);
    expect(operationResult.status).toBe(403);
    expect(operationResult.body.message).toBe("administrator-role-required");
    expect(users[0]?.blocked).toBe(false);
  });
});
