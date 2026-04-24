import type {
  AssignableUserRole,
  UserSummary,
} from "@/modules/user-management/types";

export interface AssignableRoleOption {
  readonly value: AssignableUserRole;
  readonly label: string;
}

const ROLE_OPTION_LABELS: Record<AssignableUserRole, string> = {
  barista: "Бариста",
  administrator: "Администратор",
};

export function getAssignableRoleOptions(
  user: UserSummary | null,
): readonly AssignableRoleOption[] {
  if (!user) {
    return [];
  }

  return user.availableRoleAssignments.map((role) => ({
    value: role,
    label: ROLE_OPTION_LABELS[role],
  }));
}

export function getFirstAssignableRole(
  user: UserSummary | null,
): AssignableUserRole | "" {
  return user?.availableRoleAssignments[0] ?? "";
}

export function canAssignRole(user: UserSummary | null): boolean {
  return (user?.availableRoleAssignments.length ?? 0) > 0;
}

export function getAssignableRoleLabel(role: AssignableUserRole): string {
  return ROLE_OPTION_LABELS[role];
}
