import type { Role } from "@/modules/auth/types";
import type {
  AssignableUserRole,
  UserManagementErrorCode,
  UserManagementUser,
  UsersFilter,
} from "@/modules/users/types";

export interface UserBadgePresentation {
  readonly label: string;
  readonly className: string;
}

export const usersRoleAssignmentSuccessMessage = "Роль назначена";

export function filterUserManagementUsers(
  users: readonly UserManagementUser[],
  filter: UsersFilter,
  query: string,
): readonly UserManagementUser[] {
  const normalizedQuery = query.trim().toLowerCase();

  return users.filter((user) => {
    if (normalizedQuery && !matchesUserSearch(user, normalizedQuery)) {
      return false;
    }

    if (filter === "barista") {
      return getPrimaryOperationalRole(user.roles) === "barista";
    }

    if (filter === "blocked") {
      return user.blocked;
    }

    return true;
  });
}

export function getPrimaryOperationalRole(roles: readonly Role[]): Role {
  if (roles.includes("administrator")) {
    return "administrator";
  }

  if (roles.includes("barista")) {
    return "barista";
  }

  return "customer";
}

export function getAssignableRoleInitialValue(
  roles: readonly Role[],
): AssignableUserRole {
  const primaryRole = getPrimaryOperationalRole(roles);
  return primaryRole === "administrator" ? "administrator" : "barista";
}

export function getUserDisplayLabel(user: UserManagementUser): string {
  const label = user.displayLabel?.trim();
  if (label) {
    return label;
  }

  return `Telegram ${user.telegramId}`;
}

export function getUserTelegramLabel(user: UserManagementUser): string {
  const telegramId = user.telegramId.trim();
  if (!telegramId) {
    return "";
  }

  return telegramId.startsWith("@") ? telegramId : `@${telegramId}`;
}

export function getUserInitials(user: UserManagementUser): string {
  const label = getUserDisplayLabel(user);
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "U";
}

export function resolveUserRoleBadge(
  roles: readonly Role[],
): UserBadgePresentation {
  const primaryRole = getPrimaryOperationalRole(roles);
  if (primaryRole === "administrator") {
    return {
      label: "Администратор",
      className: "users-role-badge--administrator",
    };
  }

  if (primaryRole === "barista") {
    return {
      label: "Бариста",
      className: "users-role-badge--barista",
    };
  }

  return {
    label: "Клиент",
    className: "users-role-badge--customer",
  };
}

export function resolveUserStatusBadge(
  blocked: boolean,
): UserBadgePresentation {
  return blocked
    ? {
        label: "Заблокирован",
        className: "users-status-badge--blocked",
      }
    : {
        label: "Активен",
        className: "users-status-badge--active",
      };
}

export function mapUserManagementLoadError(
  code: UserManagementErrorCode | null,
): string {
  if (
    code === "administrator-role-required" ||
    code === "backoffice-capability-forbidden"
  ) {
    return "Доступ к управлению пользователями доступен только администратору.";
  }

  return "Не удалось загрузить пользователей. Попробуйте ещё раз.";
}

export function mapUserManagementAssignError(
  code: UserManagementErrorCode | null,
): string | null {
  switch (code) {
    case "administrator-role-required":
    case "backoffice-capability-forbidden":
      return "Доступ к назначению ролей доступен только администратору.";
    case "main-administrator-required":
      return "Назначить роль администратора может только главный администратор.";
    case "role-not-assignable":
      return "Выбранную роль нельзя назначить.";
    case "user-not-found":
      return "Пользователь недоступен. Обновите список и попробуйте ещё раз.";
    case "user-management-request-failed":
      return "Не удалось назначить роль. Попробуйте ещё раз.";
    default:
      return null;
  }
}

function matchesUserSearch(
  user: UserManagementUser,
  normalizedQuery: string,
): boolean {
  const haystack = [
    getUserDisplayLabel(user),
    user.telegramId,
    getUserTelegramLabel(user),
    resolveUserRoleBadge(user.roles).label,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}
