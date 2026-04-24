import { randomUUID } from "node:crypto";
import { Role } from "./role";

export interface User {
  readonly userId: string;
  readonly telegramId: string;
  readonly displayName: string;
  readonly telegramUsername: string;
  readonly roles: readonly Role[];
  readonly blocked: boolean;
}

export function createUser(input: {
  telegramId: string;
  displayName?: string;
  telegramUsername?: string;
  roles: readonly Role[];
  blocked?: boolean;
  userId?: string;
}): User {
  return {
    userId: input.userId ?? randomUUID(),
    telegramId: input.telegramId,
    displayName: normalizeDisplayName(input.displayName, input.telegramId),
    telegramUsername: normalizeTelegramUsername(input.telegramUsername),
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

export function withAssignedRole(user: User, role: Role): User {
  return withRoles(user, [role]);
}

function uniqueRoles(roles: readonly Role[]): Role[] {
  return [...new Set(roles)];
}

function normalizeDisplayName(
  displayName: string | undefined,
  telegramId: string,
): string {
  const normalized = displayName?.trim();
  return normalized && normalized.length > 0 ? normalized : telegramId;
}

function normalizeTelegramUsername(
  telegramUsername: string | undefined,
): string {
  return telegramUsername?.trim() ?? "";
}
