export const ROLES = ["customer", "barista", "administrator"] as const;
export const ASSIGNABLE_ROLES = ["barista", "administrator"] as const;

export type Role = (typeof ROLES)[number];
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
}

export function isAssignableRole(value: string): value is AssignableRole {
  return ASSIGNABLE_ROLES.includes(value as AssignableRole);
}

export const BACKOFFICE_CAPABILITIES = [
  "orders",
  "availability",
  "menu",
  "users",
  "settings",
] as const;

export type BackofficeCapability = (typeof BACKOFFICE_CAPABILITIES)[number];

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

export function hasRole(roles: readonly Role[], role: Role): boolean {
  return roles.includes(role);
}
