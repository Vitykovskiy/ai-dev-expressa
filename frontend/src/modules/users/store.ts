import { reactive, readonly } from "vue";
import {
  createUserManagementApi,
  UserManagementApiError,
  type UserManagementClient,
} from "@/modules/users/api";
import type {
  AssignUserRolePayload,
  UserManagementErrorCode,
  UserManagementState,
  UserManagementUser,
} from "@/modules/users/types";

const state = reactive<UserManagementState>({
  loadStatus: "idle",
  assignStatus: "idle",
  users: [],
  loadErrorCode: null,
  assignErrorCode: null,
  assigningUserId: null,
});

let api: UserManagementClient = createUserManagementApi();
let pendingLoad: Promise<readonly UserManagementUser[]> | null = null;

export function useUserManagementStore() {
  return {
    state: readonly(state),
    loadUsers,
    assignRole,
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
  state.users = [];
  state.loadErrorCode = null;
  state.assignErrorCode = null;
  state.assigningUserId = null;
  pendingLoad = null;
}

export async function loadUsers(
  options: { readonly force?: boolean } = {},
): Promise<readonly UserManagementUser[]> {
  if (!options.force && state.loadStatus === "ready") {
    return state.users;
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  state.loadStatus = "loading";
  state.loadErrorCode = null;
  pendingLoad = api
    .getUsers()
    .then((users) => {
      state.users = users;
      state.loadStatus = "ready";
      state.loadErrorCode = null;
      return users;
    })
    .catch((error) => {
      state.loadStatus = "error";
      state.loadErrorCode = resolveErrorCode(error);
      throw error;
    })
    .finally(() => {
      pendingLoad = null;
    });

  return pendingLoad;
}

export async function assignRole(
  userId: string,
  payload: AssignUserRolePayload,
): Promise<UserManagementUser> {
  state.assignStatus = "saving";
  state.assignErrorCode = null;
  state.assigningUserId = userId;

  try {
    const updatedUser = await api.assignRole(userId, payload);
    state.users = state.users.map((user) =>
      user.userId === updatedUser.userId ? updatedUser : user,
    );
    state.loadStatus = "ready";
    state.loadErrorCode = null;
    state.assignStatus = "success";
    state.assigningUserId = null;
    return updatedUser;
  } catch (error) {
    state.assignStatus = "error";
    state.assignErrorCode = resolveErrorCode(error);
    state.assigningUserId = null;
    throw error;
  }
}

export function resetAssignState(): void {
  state.assignStatus = "idle";
  state.assignErrorCode = null;
  state.assigningUserId = null;
}

function resolveErrorCode(error: unknown): UserManagementErrorCode {
  return error instanceof UserManagementApiError
    ? error.code
    : "user-management-request-failed";
}
