import { describe, expect, it, vi } from "vitest";
import { UserManagementApi, UserManagementApiError } from "@/modules/users/api";
import type { UserManagementUser } from "@/modules/users/types";

const users: readonly UserManagementUser[] = [
  {
    userId: "user/1",
    telegramId: "1001",
    displayLabel: "Иван",
    roles: ["customer"],
    blocked: false,
  },
];

const updatedUser: UserManagementUser = {
  ...users[0],
  roles: ["customer", "barista"],
  capabilities: ["orders", "availability"],
};

describe("UserManagementApi", () => {
  it("loads users with backoffice auth headers", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ users }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const api = new UserManagementApi({
      apiBaseUrl: "http://localhost:3000",
      initData: "signed-init-data",
      testTelegramId: "1001",
      fetchImpl,
    });

    await expect(api.getUsers()).resolves.toEqual(users);

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:3000/backoffice/user-management/users",
      {
        headers: {
          "content-type": "application/json",
          "x-telegram-init-data": "signed-init-data",
          "x-test-telegram-id": "1001",
        },
      },
    );
  });

  it("patches assign role payload to user role endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ user: updatedUser }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const api = new UserManagementApi({ fetchImpl });

    await expect(
      api.assignRole("user/1", { assignedRole: "barista" }),
    ).resolves.toEqual(updatedUser);

    expect(fetchImpl).toHaveBeenCalledWith(
      "/backoffice/user-management/users/user%2F1/role",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assignedRole: "barista" }),
      },
    );
  });

  it("maps documented backend errors", async () => {
    const api = new UserManagementApi({
      fetchImpl: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "user-not-found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      ),
    });

    await expect(
      api.assignRole("missing", { assignedRole: "barista" }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<UserManagementApiError>>({
        status: 404,
        code: "user-not-found",
      }),
    );
  });

  it("rejects invalid users response body", async () => {
    const api = new UserManagementApi({
      fetchImpl: vi.fn().mockResolvedValue(
        new Response(JSON.stringify(users), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    });

    await expect(api.getUsers()).rejects.toEqual(
      expect.objectContaining<Partial<UserManagementApiError>>({
        code: "user-management-request-failed",
      }),
    );
  });
});
