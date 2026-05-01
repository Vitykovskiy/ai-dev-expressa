export const ROLES = ["customer", "barista", "administrator"] as const;

export type Role = (typeof ROLES)[number];

export const BACKOFFICE_CAPABILITIES = [
  "orders",
  "availability",
  "menu",
  "users",
  "settings",
] as const;

export type BackofficeCapability = (typeof BACKOFFICE_CAPABILITIES)[number];

export const ASSIGNABLE_BACKOFFICE_ROLES = [
  "barista",
  "administrator",
] as const;

export type AssignableBackofficeRole =
  (typeof ASSIGNABLE_BACKOFFICE_ROLES)[number];

const roleCapabilities: Record<Role, readonly BackofficeCapability[]> = {
  customer: [],
  barista: ["orders", "availability"],
  administrator: ["orders", "availability", "menu", "users", "settings"],
};

export function canAccessBackofficeCapability(
  roles: readonly Role[],
  capability: BackofficeCapability,
): boolean {
  return roles.some((role) => roleCapabilities[role].includes(capability));
}

export function visibleBackofficeCapabilities(
  roles: readonly Role[],
): BackofficeCapability[] {
  return BACKOFFICE_CAPABILITIES.filter((capability) =>
    canAccessBackofficeCapability(roles, capability),
  );
}

export function isAssignableBackofficeRole(
  role: unknown,
): role is AssignableBackofficeRole {
  return ASSIGNABLE_BACKOFFICE_ROLES.includes(role as AssignableBackofficeRole);
}
