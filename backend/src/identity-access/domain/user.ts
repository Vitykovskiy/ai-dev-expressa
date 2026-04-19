import { randomUUID } from "node:crypto";
import { Role } from "./role";

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

function uniqueRoles(roles: readonly Role[]): Role[] {
  return [...new Set(roles)];
}
