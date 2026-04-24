import { describe, expect, it, vi } from "vitest";
import { UserManagementApi } from "@/modules/user-management/api";

describe("UserManagementApi", () => {
  it("sends search and filter params to GET /backoffice/users", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          meta: { total: 0 },
        }),
      ),
    );
    const api = new UserManagementApi({
      apiBaseUrl: "https://example.test",
      fetchImpl,
      initData: "init-data",
      testTelegramId: "123",
    });

    await api.getUsers({ search: "иван", filter: "blocked" });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.test/backoffice/users?search=%D0%B8%D0%B2%D0%B0%D0%BD&blocked=true",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-telegram-init-data": "init-data",
          "x-test-telegram-id": "123",
        }),
      }),
    );
  });

  it("sends PATCH /role payload and parses success response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          userId: "usr_1",
          roles: ["customer", "barista"],
          backofficeAccess: { capabilities: ["orders", "availability"] },
        }),
      ),
    );
    const api = new UserManagementApi({
      fetchImpl,
      initData: "init-data",
    });

    const result = await api.assignRole("usr_1", { role: "barista" });

    expect(fetchImpl).toHaveBeenCalledWith(
      "/backoffice/users/usr_1/role",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ role: "barista" }),
      }),
    );
    expect(result.roles).toEqual(["customer", "barista"]);
  });

  it("keeps business error code from the backend", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "administrator-role-assignment-forbidden",
        }),
        { status: 403 },
      ),
    );
    const api = new UserManagementApi({ fetchImpl });

    await expect(
      api.assignRole("usr_1", { role: "administrator" }),
    ).rejects.toEqual(
      expect.objectContaining({
        code: "administrator-role-assignment-forbidden",
        status: 403,
      }),
    );
  });
});
