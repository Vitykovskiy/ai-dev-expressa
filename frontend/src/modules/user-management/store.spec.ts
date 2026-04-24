import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UserManagementApiError,
  type UserManagementClient,
} from "@/modules/user-management/api";
import {
  resetUserManagementStore,
  setUserManagementApiForTests,
  useUserManagementStore,
} from "@/modules/user-management/store";
import type { UsersListSnapshot } from "@/modules/user-management/types";

const initialSnapshot: UsersListSnapshot = {
  items: [
    {
      userId: "usr_1",
      displayName: "Иван Петров",
      telegramUsername: "@ivan_petrov",
      roles: ["customer"],
      blocked: false,
      availableRoleAssignments: ["barista", "administrator"],
    },
  ],
  total: 1,
};

const updatedSnapshot: UsersListSnapshot = {
  items: [
    {
      userId: "usr_1",
      displayName: "Иван Петров",
      telegramUsername: "@ivan_petrov",
      roles: ["customer", "barista"],
      blocked: false,
      availableRoleAssignments: ["barista", "administrator"],
    },
  ],
  total: 1,
};

function createApiMock(
  overrides: Partial<UserManagementClient> = {},
): UserManagementClient {
  return {
    getUsers: vi.fn().mockResolvedValue(initialSnapshot),
    assignRole: vi.fn().mockResolvedValue({
      userId: "usr_1",
      roles: ["customer", "barista"],
      backofficeAccess: { capabilities: ["orders", "availability"] },
    }),
    ...overrides,
  };
}

describe("user management store", () => {
  beforeEach(() => {
    setUserManagementApiForTests(createApiMock());
  });

  it("loads users with store-controlled search and filter", async () => {
    const api = createApiMock();
    setUserManagementApiForTests(api);
    const store = useUserManagementStore();

    store.setSearch("иван");
    store.setFilter("barista");
    await store.loadUsers();

    expect(api.getUsers).toHaveBeenCalledWith({
      search: "иван",
      filter: "barista",
    });
    expect(store.state.snapshot).toEqual(initialSnapshot);
  });

  it("keeps backend guard code after assign failure", async () => {
    const error = new UserManagementApiError(
      "administrator-role-assignment-forbidden",
      403,
      "administrator-role-assignment-forbidden",
    );
    setUserManagementApiForTests(
      createApiMock({
        assignRole: vi.fn().mockRejectedValue(error),
      }),
    );
    const store = useUserManagementStore();

    await expect(
      store.assignRole("usr_1", { role: "administrator" }),
    ).rejects.toBe(error);
    expect(store.state.assignStatus).toBe("error");
    expect(store.state.assignErrorCode).toBe(
      "administrator-role-assignment-forbidden",
    );
  });

  it("patches current snapshot immediately after successful assignment", async () => {
    const api = createApiMock({
      getUsers: vi
        .fn()
        .mockResolvedValueOnce(initialSnapshot)
        .mockResolvedValueOnce(updatedSnapshot),
    });
    setUserManagementApiForTests(api);
    const store = useUserManagementStore();

    await store.loadUsers();
    await store.assignRole("usr_1", { role: "barista" });

    expect(store.state.snapshot?.items[0]?.roles).toEqual([
      "customer",
      "barista",
    ]);
    expect(store.state.assignStatus).toBe("success");
  });

  it("stores read error code when loading fails", async () => {
    const error = new UserManagementApiError(
      "identity-access-read-failed",
      500,
      "identity-access-read-failed",
    );
    setUserManagementApiForTests(
      createApiMock({
        getUsers: vi.fn().mockRejectedValue(error),
      }),
    );
    const store = useUserManagementStore();

    await expect(store.loadUsers()).rejects.toBe(error);
    expect(store.state.loadStatus).toBe("error");
    expect(store.state.loadErrorCode).toBe("identity-access-read-failed");

    resetUserManagementStore();
  });
});
