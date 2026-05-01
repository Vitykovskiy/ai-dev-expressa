import type { BackofficeCapability, Role } from "@/modules/auth/types";

export const ASSIGNABLE_USER_ROLES = ["barista", "administrator"] as const;

export type AssignableUserRole = (typeof ASSIGNABLE_USER_ROLES)[number];

export type UsersFilter = "all" | "barista" | "blocked";

export interface UserManagementUser {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly Role[];
  readonly blocked: boolean;
  readonly displayLabel?: string | null;
  readonly capabilities?: readonly BackofficeCapability[];
}

export interface AssignUserRolePayload {
  readonly assignedRole: AssignableUserRole;
}

export type UserManagementErrorCode =
  | "administrator-role-required"
  | "main-administrator-required"
  | "role-not-assignable"
  | "user-not-found"
  | "backoffice-capability-forbidden"
  | "user-management-request-failed";

export interface UserManagementState {
  loadStatus: "idle" | "loading" | "ready" | "error";
  assignStatus: "idle" | "saving" | "success" | "error";
  users: readonly UserManagementUser[];
  loadErrorCode: UserManagementErrorCode | null;
  assignErrorCode: UserManagementErrorCode | null;
  assigningUserId: string | null;
}
