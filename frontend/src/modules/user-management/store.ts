import { reactive, readonly } from "vue";
import {
  createUserManagementApi,
  UserManagementApiError,
  type UserManagementClient,
} from "@/modules/user-management/api";
import type {
  AssignUserRolePayload,
  AssignUserRoleResult,
  UserListFilter,
  UserManagementErrorCode,
  UserManagementState,
  UsersListSnapshot,
} from "@/modules/user-management/types";

const state = reactive<UserManagementState>({
  loadStatus: "idle",
  assignStatus: "idle",
  snapshot: null,
  search: "",
  filter: "all",
  loadErrorCode: null,
  assignErrorCode: null,
});

let api: UserManagementClient = createUserManagementApi();
let lastLoadRequestId = 0;

export function useUserManagementStore() {
  return {
    state: readonly(state),
    loadUsers,
    assignRole,
    setSearch,
    setFilter,
    resetAssignState,
  };
}

export function setUserManagementApiForTests(
  nextApi: UserManagementClient,
): void {
  api = nextApi;
  resetUserManagementStore();
}

export function resetUserManagementStore(): void {
  state.loadStatus = "idle";
  state.assignStatus = "idle";
  state.snapshot = null;
  state.search = "";
  state.filter = "all";
  state.loadErrorCode = null;
  state.assignErrorCode = null;
  lastLoadRequestId = 0;
}

export function setSearch(value: string): void {
  state.search = value;
}

export function setFilter(value: UserListFilter): void {
  state.filter = value;
}

export async function loadUsers(): Promise<UsersListSnapshot> {
  const requestId = ++lastLoadRequestId;
  state.loadStatus = "loading";
  state.loadErrorCode = null;

  try {
    const snapshot = await api.getUsers({
      search: state.search,
      filter: state.filter,
    });

    if (requestId !== lastLoadRequestId) {
      return snapshot;
    }

    state.snapshot = snapshot;
    state.loadStatus = "ready";
    state.loadErrorCode = null;
    return snapshot;
  } catch (error) {
    if (requestId === lastLoadRequestId) {
      state.loadStatus = "error";
      state.loadErrorCode = resolveErrorCode(error);
    }

    throw error;
  }
}

export async function assignRole(
  userId: string,
  payload: AssignUserRolePayload,
): Promise<AssignUserRoleResult> {
  state.assignStatus = "saving";
  state.assignErrorCode = null;

  try {
    const result = await api.assignRole(userId, payload);
    state.assignStatus = "success";
    patchAssignedUser(result);
    void loadUsers().catch(() => undefined);
    return result;
  } catch (error) {
    state.assignStatus = "error";
    state.assignErrorCode = resolveErrorCode(error);
    throw error;
  }
}

export function resetAssignState(): void {
  state.assignStatus = "idle";
  state.assignErrorCode = null;
}

function patchAssignedUser(result: AssignUserRoleResult): void {
  if (!state.snapshot) {
    return;
  }

  state.snapshot = {
    ...state.snapshot,
    items: state.snapshot.items.map((user) =>
      user.userId === result.userId
        ? {
            ...user,
            roles: result.roles,
          }
        : user,
    ),
  };
}

function resolveErrorCode(error: unknown): UserManagementErrorCode {
  return error instanceof UserManagementApiError
    ? error.code
    : "user-management-request-failed";
}
