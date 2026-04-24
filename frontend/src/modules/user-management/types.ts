import type { BackofficeCapability, Role } from "@/modules/auth/types";

export const USER_ASSIGNABLE_ROLES = ["barista", "administrator"] as const;

export type AssignableUserRole = (typeof USER_ASSIGNABLE_ROLES)[number];

export const USER_LIST_FILTERS = ["all", "barista", "blocked"] as const;

export type UserListFilter = (typeof USER_LIST_FILTERS)[number];

export interface UserSummary {
  readonly userId: string;
  readonly displayName: string;
  readonly telegramUsername: string;
  readonly roles: readonly Role[];
  readonly blocked: boolean;
  readonly availableRoleAssignments: readonly AssignableUserRole[];
}

export interface UsersListSnapshot {
  readonly items: readonly UserSummary[];
  readonly total: number;
}

export interface ReadUsersParams {
  readonly search?: string;
  readonly filter?: UserListFilter;
}

export interface AssignUserRolePayload {
  readonly role: AssignableUserRole;
}

export interface AssignUserRoleResult {
  readonly userId: string;
  readonly roles: readonly Role[];
  readonly backofficeAccess: {
    readonly capabilities: readonly BackofficeCapability[];
  };
}

export type UserManagementErrorCode =
  | "telegram-init-data-required"
  | "telegram-bot-token-required"
  | "telegram-hash-invalid"
  | "backoffice-capability-forbidden"
  | "administrator-role-required"
  | "administrator-role-assignment-forbidden"
  | "role-not-assignable"
  | "user-not-found"
  | "identity-access-read-failed"
  | "identity-access-write-failed"
  | "user-management-request-failed";

export interface UserManagementState {
  loadStatus: "idle" | "loading" | "ready" | "error";
  assignStatus: "idle" | "saving" | "success" | "error";
  snapshot: UsersListSnapshot | null;
  search: string;
  filter: UserListFilter;
  loadErrorCode: UserManagementErrorCode | null;
  assignErrorCode: UserManagementErrorCode | null;
}

export interface UserRoleAssignmentDraft {
  readonly userId: string;
  readonly name: string;
  readonly telegramUsername: string;
  readonly role: AssignableUserRole | "";
}

export interface UserRoleAssignmentFieldErrors {
  userId: string | null;
  name: string | null;
  telegramUsername: string | null;
  role: string | null;
}

export interface UserRoleAssignmentValidationResult {
  readonly valid: boolean;
  readonly payload: {
    readonly userId: string;
    readonly role: AssignableUserRole;
  } | null;
  readonly errors: UserRoleAssignmentFieldErrors;
}
