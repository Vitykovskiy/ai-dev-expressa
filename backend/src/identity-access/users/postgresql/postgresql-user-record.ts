import { isRole, type Role } from "../../domain/role";
import { createUser, type User } from "../../domain/user";

export interface PostgresqlUserRecord {
  readonly user_id: string;
  readonly telegram_id: string;
  readonly display_name: string;
  readonly telegram_username: string;
  readonly blocked: boolean;
  readonly roles: readonly string[];
}

export function mapPostgresqlUserRecordToDomain(
  record: PostgresqlUserRecord,
): User {
  return createUser({
    userId: record.user_id,
    telegramId: record.telegram_id,
    displayName: record.display_name,
    telegramUsername: record.telegram_username,
    blocked: record.blocked,
    roles: normalizeRoles(record.roles),
  });
}

function normalizeRoles(values: readonly string[]): Role[] {
  return values.filter(isRole);
}
