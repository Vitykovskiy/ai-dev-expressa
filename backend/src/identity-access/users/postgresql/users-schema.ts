export interface SqlQueryable {
  query(queryText: string, values?: readonly unknown[]): Promise<unknown>;
}

const USERS_SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS identity_access_users (
      user_id TEXT PRIMARY KEY,
      telegram_id TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL DEFAULT '',
      telegram_username TEXT NOT NULL DEFAULT '',
      blocked BOOLEAN NOT NULL DEFAULT FALSE
    )
  `,
  `
    ALTER TABLE identity_access_users
      ADD COLUMN IF NOT EXISTS display_name TEXT NOT NULL DEFAULT ''
  `,
  `
    ALTER TABLE identity_access_users
      ADD COLUMN IF NOT EXISTS telegram_username TEXT NOT NULL DEFAULT ''
  `,
  `
    CREATE TABLE IF NOT EXISTS identity_access_user_roles (
      user_id TEXT NOT NULL REFERENCES identity_access_users(user_id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      PRIMARY KEY (user_id, role),
      CONSTRAINT identity_access_user_roles_role_check
        CHECK (role IN ('customer', 'barista', 'administrator'))
    )
  `,
  `
    CREATE INDEX IF NOT EXISTS identity_access_users_telegram_id_idx
      ON identity_access_users (telegram_id)
  `,
  `
    CREATE INDEX IF NOT EXISTS identity_access_users_display_name_idx
      ON identity_access_users (display_name)
  `,
  `
    CREATE INDEX IF NOT EXISTS identity_access_users_telegram_username_idx
      ON identity_access_users (telegram_username)
  `,
];

export async function applyUsersSchema(queryable: SqlQueryable): Promise<void> {
  for (const statement of USERS_SCHEMA_STATEMENTS) {
    await queryable.query(statement);
  }
}
