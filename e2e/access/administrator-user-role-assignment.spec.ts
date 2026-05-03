import { expect, test } from "@playwright/test";

import {
  annotateScenarioIds,
  mockSessionBootstrap,
  type ManagedUser,
} from "./support/access-helpers";
import {
  ADMINISTRATOR_CAPABILITIES,
  BARISTA_CAPABILITIES,
  chooseRoleAndSubmit,
  fulfillJson,
  mainAdministratorActor,
  mockUsersList,
  openAssignRoleDialog,
  ordinaryAdministratorActor,
  targetCustomer,
  targetUserIdFromRoute,
} from "./support/user-role-management-helpers";

test.describe("administrator user role assignment", () => {
  test("F004-SC-003 administrator assigns barista", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["F004-SC-003"]);

    let assignmentPayload: { readonly assignedRole?: string } | undefined;
    let users: readonly ManagedUser[] = [targetCustomer];
    await mockUsersList(page, () => users);
    await page.route(
      "**/backoffice/user-management/users/*/role",
      async (route) => {
        assignmentPayload = (route.request().postDataJSON() ?? {}) as {
          readonly assignedRole?: string;
        };
        expect(targetUserIdFromRoute(route)).toBe(targetCustomer.userId);
        expect(assignmentPayload).toEqual({ assignedRole: "barista" });

        const updatedUser: ManagedUser = {
          ...targetCustomer,
          roles: ["customer", "barista"],
          capabilities: BARISTA_CAPABILITIES,
        };
        users = [updatedUser];

        await fulfillJson(route, 200, { user: updatedUser });
      },
    );

    await page.goto("/users");
    await expect(page.getByText("@94004001")).toBeVisible();
    await expect(page.getByText("Клиент")).toBeVisible();

    await openAssignRoleDialog(page);
    const assignmentResponsePromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/backoffice/user-management/users/${targetCustomer.userId}/role`,
          ) && response.request().method() === "PATCH",
    );
    await chooseRoleAndSubmit(page, "barista");
    const assignmentResponse = await assignmentResponsePromise;
    const assignmentBody = (await assignmentResponse.json()) as {
      readonly user: ManagedUser;
    };

    expect(assignmentResponse.status()).toBe(200);
    expect(assignmentPayload).toEqual({ assignedRole: "barista" });
    expect(assignmentBody.user.roles).toEqual(["customer", "barista"]);
    expect(assignmentBody.user.capabilities).toEqual(BARISTA_CAPABILITIES);
    await expect(page.getByText("Бариста")).toBeVisible();
    await expect(page.getByText("Роль назначена")).toBeVisible();
  });

  test("F004-SC-007 main administrator assigns administrator", async ({
    page,
  }, testInfo) => {
    annotateScenarioIds(testInfo, ["F004-SC-007"]);

    let currentActor = ordinaryAdministratorActor;
    let users: readonly ManagedUser[] = [targetCustomer];
    let lastAssignmentPayload: { readonly assignedRole?: string } | undefined;

    await mockSessionBootstrap(page, () => currentActor);
    await mockUsersList(page, () => users);
    await page.route(
      "**/backoffice/user-management/users/*/role",
      async (route) => {
        lastAssignmentPayload = (route.request().postDataJSON() ?? {}) as {
          readonly assignedRole?: string;
        };

        if (
          lastAssignmentPayload.assignedRole === "administrator" &&
          currentActor.telegramId !== mainAdministratorActor.telegramId
        ) {
          await fulfillJson(route, 403, {
            message: "main-administrator-required",
            error: "Forbidden",
            statusCode: 403,
          });
          return;
        }

        const updatedUser: ManagedUser = {
          ...targetCustomer,
          roles: ["customer", "administrator"],
          capabilities: ADMINISTRATOR_CAPABILITIES,
        };
        users = [updatedUser];

        await fulfillJson(route, 200, { user: updatedUser });
      },
    );

    await page.goto("/users");
    await openAssignRoleDialog(page);
    const rejectionResponsePromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/backoffice/user-management/users/${targetCustomer.userId}/role`,
          ) && response.request().method() === "PATCH",
    );
    await chooseRoleAndSubmit(page, "administrator");
    const rejectionResponse = await rejectionResponsePromise;
    const rejectionBody = (await rejectionResponse.json()) as {
      readonly message?: string;
    };

    expect(rejectionResponse.status()).toBe(403);
    expect(rejectionBody.message).toBe("main-administrator-required");
    expect(lastAssignmentPayload).toEqual({ assignedRole: "administrator" });
    await expect(page.getByText("Клиент")).toBeVisible();
    await expect(
      page.getByText(
        "Назначить роль администратора может только главный администратор.",
      ),
    ).toBeVisible();

    currentActor = mainAdministratorActor;
    await page.goto("/users");
    await openAssignRoleDialog(page);
    const successResponsePromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/backoffice/user-management/users/${targetCustomer.userId}/role`,
          ) && response.request().method() === "PATCH",
    );
    await chooseRoleAndSubmit(page, "administrator");
    const successResponse = await successResponsePromise;
    const successBody = (await successResponse.json()) as {
      readonly user: ManagedUser;
    };

    expect(successResponse.status()).toBe(200);
    expect(lastAssignmentPayload).toEqual({ assignedRole: "administrator" });
    expect(successBody.user.roles).toEqual(["customer", "administrator"]);
    expect(successBody.user.capabilities).toEqual(ADMINISTRATOR_CAPABILITIES);
    await expect(page.getByText("Роль назначена")).toBeVisible();
    await expect(page.getByText("@94004001")).toBeVisible();
  });
});
