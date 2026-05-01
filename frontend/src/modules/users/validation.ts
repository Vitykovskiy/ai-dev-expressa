import {
  ASSIGNABLE_USER_ROLES,
  type AssignUserRolePayload,
  type AssignableUserRole,
} from "@/modules/users/types";

export interface AssignRoleValidationResult {
  readonly valid: boolean;
  readonly payload: AssignUserRolePayload | null;
  readonly message: string | null;
}

export function isAssignableUserRole(
  value: unknown,
): value is AssignableUserRole {
  return (
    typeof value === "string" &&
    ASSIGNABLE_USER_ROLES.includes(value as AssignableUserRole)
  );
}

export function validateAssignRole(
  assignedRole: unknown,
): AssignRoleValidationResult {
  if (!isAssignableUserRole(assignedRole)) {
    return {
      valid: false,
      payload: null,
      message: "Выберите роль: Бариста или Администратор.",
    };
  }

  return {
    valid: true,
    payload: { assignedRole },
    message: null,
  };
}
