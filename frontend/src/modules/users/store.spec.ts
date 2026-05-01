import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UserManagementApiError,
  type UserManagementClient,
} from "@/modules/users/api";
import {
  resetUserManagementStore,
  setUserManagementApiForTests,
  useUserManagementStore,
} from "@/modules/users/store";
import type { UserManagementUser } from "@/modules/users/types";

const users: readonly UserManagementUser[] = [
  {
    userId: "u-1",
    telegramId: "1001",
    displayLabel: "Иван",
    roles: ["customer"],
    blocked: false,
  },
  {
    userId: "u-2",
    telegramId: "1002",
    displayLabel: "Анна",
    roles: ["barista"],
    blocked: false,
  },
];

const updatedUser: UserManagementUser = {
  ...users[0],
  roles: ["customer", "barista"],
  capabilities: ["orders", "availability"],
};

function createApiMock(
  overrides: Partial<UserManagementClient> = {},
): UserManagementClient {
  return {
    getUsers: vi.fn().mockResolvedValue(users),
    assignRole: vi.fn().mockResolvedValue(updatedUser),
    ...overrides,
  };
}

describe("user management store", () => {
  beforeEach(() => {
    setUserManagementApiForTests(createApiMock());
  });

  it("loads and exposes users list", async () => {
    const store = useUserManagementStore();

    await store.loadUsers();

    expect(store.state.loadStatus).toBe("ready");
    expect(store.state.users).toEqual(users);
  });

  it("updates only confirmed row after successful role assignment", async () => {
    const api = createApiMock();
    setUserManagementApiForTests(api);
    const store = useUserManagementStore();

    await store.loadUsers();
    await store.assignRole("u-1", { assignedRole: "barista" });

    expect(api.assignRole).toHaveBeenCalledWith("u-1", {
      assignedRole: "barista",
    });
    expect(store.state.assignStatus).toBe("success");
    expect(store.state.users).toEqual([updatedUser, users[1]]);
  });

  it("preserves last confirmed state on assignment failure", async () => {
    const error = new UserManagementApiError(
      "main-administrator-required",
      403,
      "main-administrator-required",
    );
    setUserManagementApiForTests(
      createApiMock({
        assignRole: vi.fn().mockRejectedValue(error),
      }),
    );
    const store = useUserManagementStore();

    await store.loadUsers();
    await expect(
      store.assignRole("u-1", { assignedRole: "administrator" }),
    ).rejects.toBe(error);

    expect(store.state.assignStatus).toBe("error");
    expect(store.state.assignErrorCode).toBe("main-administrator-required");
    expect(store.state.users).toEqual(users);

    resetUserManagementStore();
  });
});
