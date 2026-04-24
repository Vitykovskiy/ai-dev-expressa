import { describe, expect, it } from "vitest";
import {
  loadUsersPostgresqlConfig,
  UsersPostgresqlConfigValidationError,
} from "../src/identity-access/config/postgresql-config";

describe("loadUsersPostgresqlConfig", () => {
  it("requires DATABASE_URL", () => {
    expect(() => loadUsersPostgresqlConfig({})).toThrow(
      UsersPostgresqlConfigValidationError,
    );
  });

  it("rejects a non-PostgreSQL protocol", () => {
    expect(() =>
      loadUsersPostgresqlConfig({
        DATABASE_URL: "mysql://expressa:expressa@127.0.0.1:3306/expressa",
      }),
    ).toThrow(
      "DATABASE_URL must use the postgres:// or postgresql:// protocol.",
    );
  });

  it("accepts a PostgreSQL connection string", () => {
    expect(
      loadUsersPostgresqlConfig({
        DATABASE_URL: "postgres://expressa:expressa@127.0.0.1:5432/expressa",
      }),
    ).toEqual({
      databaseUrl: "postgres://expressa:expressa@127.0.0.1:5432/expressa",
    });
  });
});
