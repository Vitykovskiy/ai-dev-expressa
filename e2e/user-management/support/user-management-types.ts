export const USER_MANAGEMENT_ASSIGNABLE_ROLES = [
  "barista",
  "administrator",
] as const;

export type UserManagementAssignableRole =
  (typeof USER_MANAGEMENT_ASSIGNABLE_ROLES)[number];

export type UserManagementRole = "customer" | "barista" | "administrator";

export type UserManagementCapability =
  | "orders"
  | "availability"
  | "menu"
  | "users"
  | "settings";

export interface UserManagementActor {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly UserManagementRole[];
  readonly capabilities: readonly UserManagementCapability[];
}

export interface UserManagementSessionPayload {
  readonly initData?: string;
  readonly testTelegramId?: string;
}

export interface UserManagementErrorResponse {
  readonly status: number;
  readonly code: string;
}

export interface UserManagementUser {
  readonly userId: string;
  readonly displayName: string;
  readonly telegramUsername: string;
  readonly roles: readonly UserManagementRole[];
  readonly blocked: boolean;
  readonly availableRoleAssignments: readonly UserManagementAssignableRole[];
}

export interface UserManagementListResponse {
  readonly items: readonly UserManagementUser[];
  readonly meta: {
    readonly total: number;
  };
}

export interface AssignUserRoleResponse {
  readonly userId: string;
  readonly roles: readonly UserManagementRole[];
  readonly backofficeAccess: {
    readonly capabilities: readonly UserManagementCapability[];
  };
}

export interface AssignUserRoleRequest {
  readonly role: UserManagementAssignableRole;
}

export interface ReadUsersListParams {
  readonly search?: string;
  readonly role?: Extract<UserManagementAssignableRole, "barista">;
  readonly blocked?: boolean;
}
