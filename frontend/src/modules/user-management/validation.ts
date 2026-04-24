import type {
  AssignableUserRole,
  UserRoleAssignmentFieldErrors,
  UserRoleAssignmentDraft,
  UserRoleAssignmentValidationResult,
} from "@/modules/user-management/types";

export function createEmptyRoleAssignmentErrors(): UserRoleAssignmentFieldErrors {
  return {
    userId: null,
    name: null,
    telegramUsername: null,
    role: null,
  };
}

export function validateRoleAssignmentDraft(
  draft: UserRoleAssignmentDraft,
  availableRoles: readonly AssignableUserRole[],
): UserRoleAssignmentValidationResult {
  const errors = createEmptyRoleAssignmentErrors();

  if (!draft.userId.trim()) {
    errors.userId = "Выберите пользователя.";
  }

  if (!draft.name.trim()) {
    errors.name = "Укажите имя.";
  }

  if (!draft.telegramUsername.trim()) {
    errors.telegramUsername = "Укажите Telegram Username.";
  }

  if (!draft.role) {
    errors.role = "Выберите роль.";
  } else if (!availableRoles.includes(draft.role)) {
    errors.role = "Выберите допустимую роль.";
  }

  const valid = Object.values(errors).every((value) => value === null);
  const role = draft.role;

  return {
    valid,
    payload: valid
      ? {
          userId: draft.userId,
          role: role as AssignableUserRole,
        }
      : null,
    errors,
  };
}
