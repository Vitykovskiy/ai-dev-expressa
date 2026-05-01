import { randomUUID } from "node:crypto";
import { AssignableBackofficeRole, Role } from "./role";

export interface User {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly Role[];
  readonly blocked: boolean;
}

export function createUser(input: {
  telegramId: string;
  roles: readonly Role[];
  blocked?: boolean;
  userId?: string;
}): User {
  return {
    userId: input.userId ?? randomUUID(),
    telegramId: input.telegramId,
    roles: uniqueRoles(input.roles),
    blocked: input.blocked ?? false,
  };
}

export function withRoles(user: User, roles: readonly Role[]): User {
  return {
    ...user,
    roles: uniqueRoles([...user.roles, ...roles]),
  };
}

export function withAssignedBackofficeRole(
  user: User,
  role: AssignableBackofficeRole,
): User {
  return {
    ...user,
    roles: uniqueRoles([
      ...user.roles.filter((existingRole) => existingRole === "customer"),
      role,
    ]),
  };
}

function uniqueRoles(roles: readonly Role[]): Role[] {
  return [...new Set(roles)];
}
