import { type Page, type Route } from "@playwright/test";

import {
  assignRoleResponse,
  assignedAdministratorUser,
  assignedBaristaUser,
  baristaCapabilities,
  bootstrapAdministratorActor,
  customerUser,
  usersListResponse,
} from "./user-management-fixtures";
import type {
  UserManagementActor,
  UserManagementUser,
} from "./user-management-types";

export interface MockUserManagementBackend {
  readonly rolePatchRequests: readonly UserRolePatchRequest[];
  readonly usersReadCount: number;
}

export interface UserRolePatchRequest {
  readonly userId: string;
  readonly role: unknown;
}

export async function mockUserManagementBackend(
  page: Page,
  options: {
    readonly actor?: UserManagementActor;
    readonly initialUser?: UserManagementUser;
  } = {},
): Promise<MockUserManagementBackend> {
  const state = {
    currentUser: options.initialUser ?? customerUser,
    rolePatchRequests: [] as UserRolePatchRequest[],
    usersReadCount: 0,
  };
  const actor = options.actor ?? bootstrapAdministratorActor;

  await page.route("**/backoffice/auth/session", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify(actor),
    });
  });

  await page.route(
    /\/backoffice\/users\/([^/?]+)\/role(?:\?.*)?$/,
    async (route) => {
      const request = route.request();
      const body = (request.postDataJSON() ?? {}) as {
        readonly role?: unknown;
      };
      const userId = decodeURIComponent(
        new URL(request.url()).pathname.split("/").at(-2) ?? "",
      );
      state.rolePatchRequests.push({ userId, role: body.role });

      if (
        !actor.roles.includes("administrator") ||
        !actor.capabilities.includes("users")
      ) {
        await fulfillJson(route, 403, {
          message: "backoffice-capability-forbidden",
        });
        return;
      }

      if (body.role !== "barista" && body.role !== "administrator") {
        await fulfillJson(route, 422, { message: "role-not-assignable" });
        return;
      }

      if (
        body.role === "administrator" &&
        actor.userId !== bootstrapAdministratorActor.userId
      ) {
        await fulfillJson(route, 403, {
          message: "administrator-role-assignment-forbidden",
        });
        return;
      }

      state.currentUser = userWithAssignedRole(state.currentUser, body.role);
      await fulfillJson(route, 200, assignRoleResponse(state.currentUser));
    },
  );

  await page.route(/\/backoffice\/users(?:\?.*)?$/, async (route) => {
    state.usersReadCount += 1;
    await fulfillJson(route, 200, usersListResponse([state.currentUser]));
  });

  return {
    get rolePatchRequests() {
      return state.rolePatchRequests;
    },
    get usersReadCount() {
      return state.usersReadCount;
    },
  };
}

function userWithAssignedRole(
  currentUser: UserManagementUser,
  role: "barista" | "administrator",
): UserManagementUser {
  if (role === "administrator") {
    return {
      ...assignedAdministratorUser,
      userId: currentUser.userId,
      displayName: currentUser.displayName,
      telegramUsername: currentUser.telegramUsername,
    };
  }

  return {
    ...assignedBaristaUser,
    userId: currentUser.userId,
    displayName: currentUser.displayName,
    telegramUsername: currentUser.telegramUsername,
    availableRoleAssignments: currentUser.availableRoleAssignments.includes(
      "administrator",
    )
      ? ["barista", "administrator"]
      : ["barista"],
  };
}

async function fulfillJson(
  route: Route,
  status: number,
  body: unknown,
): Promise<void> {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}
