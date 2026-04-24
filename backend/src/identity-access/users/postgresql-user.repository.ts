import { Injectable } from "@nestjs/common";
import type { User } from "../domain/user";
import { IdentityAccessPostgresqlClient } from "./postgresql/identity-access-postgresql.client";
import {
  mapPostgresqlUserRecordToDomain,
  type PostgresqlUserRecord,
} from "./postgresql/postgresql-user-record";
import type {
  UserListFilters,
  UserListResult,
  UserRepository,
} from "./user.repository";

interface QueryableClient {
  query<T extends PostgresqlUserRecord>(
    queryText: string,
    values?: readonly unknown[],
  ): Promise<{ rows: T[] }>;
}

@Injectable()
export class PostgresqlUserRepository implements UserRepository {
  constructor(private readonly database: IdentityAccessPostgresqlClient) {}

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    const user = await this.findOne(
      `
        SELECT
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked,
          COALESCE(
            ARRAY_AGG(ur.role ORDER BY ur.role) FILTER (WHERE ur.role IS NOT NULL),
            ARRAY[]::TEXT[]
          ) AS roles
        FROM identity_access_users u
        LEFT JOIN identity_access_user_roles ur
          ON ur.user_id = u.user_id
        WHERE u.telegram_id = $1
        GROUP BY
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked
      `,
      [telegramId],
    );

    return user;
  }

  async findByUserId(userId: string): Promise<User | undefined> {
    const user = await this.findOne(
      `
        SELECT
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked,
          COALESCE(
            ARRAY_AGG(ur.role ORDER BY ur.role) FILTER (WHERE ur.role IS NOT NULL),
            ARRAY[]::TEXT[]
          ) AS roles
        FROM identity_access_users u
        LEFT JOIN identity_access_user_roles ur
          ON ur.user_id = u.user_id
        WHERE u.user_id = $1
        GROUP BY
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked
      `,
      [userId],
    );

    return user;
  }

  async list(filters: UserListFilters): Promise<UserListResult> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.search) {
      const parameter = `%${filters.search.trim()}%`;
      values.push(parameter, parameter);
      const displayNameIndex = values.length - 1;
      const telegramUsernameIndex = values.length;
      conditions.push(
        `(u.display_name ILIKE $${displayNameIndex} OR u.telegram_username ILIKE $${telegramUsernameIndex})`,
      );
    }

    if (filters.role) {
      values.push(filters.role);
      conditions.push(
        `EXISTS (
          SELECT 1
          FROM identity_access_user_roles role_filter
          WHERE role_filter.user_id = u.user_id
            AND role_filter.role = $${values.length}
        )`,
      );
    }

    if (typeof filters.blocked === "boolean") {
      values.push(filters.blocked);
      conditions.push(`u.blocked = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await this.database.query<PostgresqlUserRecord>(
      `
        SELECT
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked,
          COALESCE(
            ARRAY_AGG(ur.role ORDER BY ur.role) FILTER (WHERE ur.role IS NOT NULL),
            ARRAY[]::TEXT[]
          ) AS roles
        FROM identity_access_users u
        LEFT JOIN identity_access_user_roles ur
          ON ur.user_id = u.user_id
        ${whereClause}
        GROUP BY
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked
        ORDER BY u.display_name ASC, u.user_id ASC
      `,
      values,
    );

    return {
      items: result.rows.map(mapPostgresqlUserRecordToDomain),
      total: result.rows.length,
    };
  }

  async save(user: User): Promise<User> {
    return this.database.withTransaction(async (client) => {
      await client.query(
        `
          INSERT INTO identity_access_users (
            user_id,
            telegram_id,
            display_name,
            telegram_username,
            blocked
          )
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (user_id) DO UPDATE SET
            telegram_id = EXCLUDED.telegram_id,
            display_name = EXCLUDED.display_name,
            telegram_username = EXCLUDED.telegram_username,
            blocked = EXCLUDED.blocked
        `,
        [
          user.userId,
          user.telegramId,
          user.displayName,
          user.telegramUsername,
          user.blocked,
        ],
      );
      await client.query(
        "DELETE FROM identity_access_user_roles WHERE user_id = $1",
        [user.userId],
      );

      if (user.roles.length > 0) {
        const values = user.roles.flatMap((role) => [user.userId, role]);
        const placeholders = user.roles
          .map((_, index) => {
            const base = index * 2;
            return `($${base + 1}, $${base + 2})`;
          })
          .join(", ");

        await client.query(
          `
            INSERT INTO identity_access_user_roles (user_id, role)
            VALUES ${placeholders}
          `,
          values,
        );
      }

      const savedUser = await this.findByUserIdWithClient(client, user.userId);
      if (!savedUser) {
        throw new Error(
          `User ${user.userId} was not found after PostgreSQL save.`,
        );
      }

      return savedUser;
    });
  }

  async clear(): Promise<void> {
    await this.database.query(
      `
        TRUNCATE TABLE
          identity_access_user_roles,
          identity_access_users
      `,
    );
  }

  private async findByUserIdWithClient(
    client: QueryableClient,
    userId: string,
  ): Promise<User | undefined> {
    const result = await client.query<PostgresqlUserRecord>(
      `
        SELECT
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked,
          COALESCE(
            ARRAY_AGG(ur.role ORDER BY ur.role) FILTER (WHERE ur.role IS NOT NULL),
            ARRAY[]::TEXT[]
          ) AS roles
        FROM identity_access_users u
        LEFT JOIN identity_access_user_roles ur
          ON ur.user_id = u.user_id
        WHERE u.user_id = $1
        GROUP BY
          u.user_id,
          u.telegram_id,
          u.display_name,
          u.telegram_username,
          u.blocked
      `,
      [userId],
    );

    return result.rows[0]
      ? mapPostgresqlUserRecordToDomain(result.rows[0])
      : undefined;
  }

  private async findOne(
    queryText: string,
    values: readonly unknown[],
  ): Promise<User | undefined> {
    const result = await this.database.query<PostgresqlUserRecord>(
      queryText,
      values,
    );

    return result.rows[0]
      ? mapPostgresqlUserRecordToDomain(result.rows[0])
      : undefined;
  }
}
