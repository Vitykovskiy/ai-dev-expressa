import { expect, test } from "@playwright/test";

import {
  annotateScenarioIds,
  baristaActor,
  expectHiddenTabs,
  expectVisibleTabs,
  mockSessionBootstrap,
} from "./support/access-helpers";
import { fulfillJson } from "./support/user-role-management-helpers";

test.describe("administrator user role access", () => {
  test("F004-SC-004 assigned barista capabilities", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["F004-SC-004"]);

    await mockSessionBootstrap(page, () => baristaActor);

    await page.goto("/");

    await expect(page.getByText("Бариста")).toBeVisible();
    await expectVisibleTabs(page, ["Заказы", "Доступность"]);
    await expectHiddenTabs(page, ["Меню", "Пользователи", "Настройки"]);

    await page.goto("/users");

    await expect(page).toHaveURL(/\/forbidden(?:\?|$)/);
    await expect(page.getByText("403")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Доступ к этой вкладке запрещён" }),
    ).toBeVisible();
  });

  test("F004-SC-005 non administrator denied users management", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["F004-SC-005"]);

    let operationPayload: { readonly assignedRole?: string } | undefined;
    await mockSessionBootstrap(page, () => baristaActor);
    await page.route(
      "**/backoffice/user-management/users/*/role",
      async (route) => {
        operationPayload = (route.request().postDataJSON() ?? {}) as {
          readonly assignedRole?: string;
        };

        await fulfillJson(route, 403, {
          message: "administrator-role-required",
          error: "Forbidden",
          statusCode: 403,
        });
      },
    );

    await page.goto("/");
    await expectHiddenTabs(page, ["Пользователи"]);

    await page.goto("/users");
    await expect(page).toHaveURL(/\/forbidden(?:\?|$)/);
    await expect(
      page.getByRole("heading", { name: "Доступ к этой вкладке запрещён" }),
    ).toBeVisible();

    const operationResult = await page.evaluate(async () => {
      const response = await fetch(
        "/backoffice/user-management/users/f004-target-customer/role",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            "x-test-telegram-id": "2002",
          },
          body: JSON.stringify({ assignedRole: "barista" }),
        },
      );

      return {
        body: (await response.json()) as { readonly message?: string },
        status: response.status,
      };
    });

    expect(operationPayload).toEqual({ assignedRole: "barista" });
    expect(operationResult.status).toBe(403);
    expect(operationResult.body.message).toBe("administrator-role-required");
  });
});
