import type {
  AssignableUserRole,
  UserManagementErrorCode,
  UserRoleAssignmentFieldErrors,
  UserSummary,
} from "@/modules/user-management/types";
import { createEmptyRoleAssignmentErrors } from "@/modules/user-management/validation";

export const USER_FILTER_TABS = [
  { id: "all", label: "Все" },
  { id: "barista", label: "Баристы" },
  { id: "blocked", label: "Заблокированные" },
] as const;

export function buildRoleAssignmentDraft(
  user: UserSummary | null,
  role: AssignableUserRole | "",
) {
  return {
    userId: user?.userId ?? "",
    name: user?.displayName ?? "",
    telegramUsername: user?.telegramUsername ?? "",
    role,
  };
}

export function mergeRoleAssignmentErrors(
  base: UserRoleAssignmentFieldErrors,
  override: Partial<UserRoleAssignmentFieldErrors>,
): UserRoleAssignmentFieldErrors {
  return {
    userId: override.userId ?? base.userId,
    name: override.name ?? base.name,
    telegramUsername: override.telegramUsername ?? base.telegramUsername,
    role: override.role ?? base.role,
  };
}

export function mapUserManagementLoadError(
  code: UserManagementErrorCode | null,
): string {
  if (code === "backoffice-capability-forbidden") {
    return "Доступ к экрану пользователей запрещён для текущей роли.";
  }

  return "Не удалось загрузить список пользователей. Попробуйте ещё раз.";
}

export function mapUserRoleAssignmentError(
  code: UserManagementErrorCode | null,
): {
  readonly fieldErrors: UserRoleAssignmentFieldErrors;
  readonly formError: string | null;
} {
  const fieldErrors = createEmptyRoleAssignmentErrors();

  switch (code) {
    case "role-not-assignable":
      return {
        fieldErrors: {
          ...fieldErrors,
          role: "Выбранная роль недоступна для назначения.",
        },
        formError: null,
      };
    case "administrator-role-assignment-forbidden":
      return {
        fieldErrors,
        formError:
          "Роль администратора может назначать только главный администратор.",
      };
    case "administrator-role-required":
    case "backoffice-capability-forbidden":
      return {
        fieldErrors,
        formError:
          "Назначение роли доступно только администратору с правом users.",
      };
    case "user-not-found":
      return {
        fieldErrors,
        formError:
          "Пользователь не найден. Обновите список и попробуйте ещё раз.",
      };
    case "identity-access-write-failed":
    case "user-management-request-failed":
      return {
        fieldErrors,
        formError: "Не удалось назначить роль. Попробуйте ещё раз.",
      };
    default:
      return {
        fieldErrors,
        formError: null,
      };
  }
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.trim()[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getPrimaryRoleLabel(user: UserSummary): string {
  if (user.roles.includes("administrator")) {
    return "Администратор";
  }

  if (user.roles.includes("barista")) {
    return "Бариста";
  }

  return "Клиент";
}

export function getRoleBadgeStyle(user: UserSummary): Record<string, string> {
  if (user.roles.includes("administrator")) {
    return {
      backgroundColor: "var(--app-color-accent-light)",
      color: "var(--app-color-accent)",
    };
  }

  return {
    backgroundColor: "var(--app-color-success-light)",
    color: "var(--app-color-success)",
  };
}

export function getStatusBadge(user: UserSummary): {
  readonly label: string;
  readonly style: Record<string, string>;
} {
  if (user.blocked) {
    return {
      label: "Заблокирован",
      style: {
        backgroundColor: "var(--app-color-destructive-light)",
        color: "var(--app-color-destructive)",
      },
    };
  }

  return {
    label: "Активен",
    style: {
      backgroundColor: "var(--app-color-success-light)",
      color: "var(--app-color-success)",
    },
  };
}

export const userRoleAssignmentSuccessMessage = "Роль пользователя обновлена";
