export interface UsersPostgresqlConfig {
  readonly databaseUrl: string;
}

export interface UsersPostgresqlConfigEnvironment {
  readonly DATABASE_URL?: string;
}

export class UsersPostgresqlConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsersPostgresqlConfigValidationError";
  }
}

export function loadUsersPostgresqlConfig(
  env: UsersPostgresqlConfigEnvironment,
): UsersPostgresqlConfig {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new UsersPostgresqlConfigValidationError("DATABASE_URL is required.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new UsersPostgresqlConfigValidationError(
      "DATABASE_URL must be a valid PostgreSQL connection string.",
    );
  }

  if (
    parsedUrl.protocol !== "postgres:" &&
    parsedUrl.protocol !== "postgresql:"
  ) {
    throw new UsersPostgresqlConfigValidationError(
      "DATABASE_URL must use the postgres:// or postgresql:// protocol.",
    );
  }

  return { databaseUrl };
}
