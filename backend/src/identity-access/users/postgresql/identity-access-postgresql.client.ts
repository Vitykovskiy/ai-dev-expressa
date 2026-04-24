import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from "pg";
import { USERS_POSTGRESQL_CONFIG } from "../../identity-access.tokens";
import type { UsersPostgresqlConfig } from "../../config/postgresql-config";
import { applyUsersSchema } from "./users-schema";

@Injectable()
export class IdentityAccessPostgresqlClient
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(IdentityAccessPostgresqlClient.name);
  private readonly pool: Pool;

  constructor(
    @Inject(USERS_POSTGRESQL_CONFIG)
    config: UsersPostgresqlConfig,
  ) {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    this.pool.on("error", (error) => {
      this.logger.error(
        "Unexpected PostgreSQL idle client error.",
        error.stack,
      );
    });
  }

  async onModuleInit(): Promise<void> {
    await applyUsersSchema(this);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }

  async query<T extends QueryResultRow>(
    queryText: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(queryText, [...values]);
  }

  async withTransaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
