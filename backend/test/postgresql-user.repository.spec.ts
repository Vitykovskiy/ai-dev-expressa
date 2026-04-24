import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { createUser } from "../src/identity-access/domain/user";
import { PostgresqlUserRepository } from "../src/identity-access/users/postgresql-user.repository";
import { IdentityAccessPostgresqlClient } from "../src/identity-access/users/postgresql/identity-access-postgresql.client";

describe("PostgresqlUserRepository", () => {
  it("reads a user by telegram id from PostgreSQL rows", async () => {
    const database = {
      query: vi.fn().mockResolvedValue({
        rows: [
          {
            user_id: "usr_1",
            telegram_id: "1001",
            display_name: "Admin User",
            telegram_username: "@admin_user",
            blocked: false,
            roles: ["customer", "administrator"],
          },
        ],
      }),
    } as unknown as IdentityAccessPostgresqlClient;
    const repository = new PostgresqlUserRepository(database);

    await expect(repository.findByTelegramId("1001")).resolves.toEqual({
      userId: "usr_1",
      telegramId: "1001",
      displayName: "Admin User",
      telegramUsername: "@admin_user",
      blocked: false,
      roles: ["customer", "administrator"],
    });
  });

  it("persists users and their roles in one transaction", async () => {
    const client = {
      query: vi
        .fn()
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [], rowCount: 2 })
        .mockResolvedValueOnce({
          rows: [
            {
              user_id: "usr_1",
              telegram_id: "1001",
              display_name: "Admin User",
              telegram_username: "@admin_user",
              blocked: false,
              roles: ["customer", "administrator"],
            },
          ],
        }),
    };
    const database = {
      withTransaction: vi.fn(async (callback) => callback(client)),
    } as unknown as IdentityAccessPostgresqlClient;
    const repository = new PostgresqlUserRepository(database);
    const user = createUser({
      userId: "usr_1",
      telegramId: "1001",
      displayName: "Admin User",
      telegramUsername: "@admin_user",
      roles: ["customer", "administrator"],
    });

    await expect(repository.save(user)).resolves.toEqual(user);
    expect(database.withTransaction).toHaveBeenCalledOnce();
    expect(client.query).toHaveBeenCalledTimes(4);
    expect(client.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("INSERT INTO identity_access_users"),
      ["usr_1", "1001", "Admin User", "@admin_user", false],
    );
    expect(client.query).toHaveBeenNthCalledWith(
      2,
      "DELETE FROM identity_access_user_roles WHERE user_id = $1",
      ["usr_1"],
    );
    expect(client.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("INSERT INTO identity_access_user_roles"),
      ["usr_1", "customer", "usr_1", "administrator"],
    );
  });

  it("lists users from PostgreSQL using filters", async () => {
    const database = {
      query: vi.fn().mockResolvedValue({
        rows: [
          {
            user_id: "usr_1",
            telegram_id: "1001",
            display_name: "Ivan Petrov",
            telegram_username: "@ivan_petrov",
            blocked: false,
            roles: ["customer", "barista"],
          },
        ],
      }),
    } as unknown as IdentityAccessPostgresqlClient;
    const repository = new PostgresqlUserRepository(database);

    await expect(
      repository.list({
        search: "ivan",
        role: "barista",
        blocked: false,
      }),
    ).resolves.toEqual({
      items: [
        {
          userId: "usr_1",
          telegramId: "1001",
          displayName: "Ivan Petrov",
          telegramUsername: "@ivan_petrov",
          blocked: false,
          roles: ["customer", "barista"],
        },
      ],
      total: 1,
    });
    expect(database.query).toHaveBeenCalledWith(
      expect.stringContaining("u.display_name ILIKE"),
      ["%ivan%", "%ivan%", "barista", false],
    );
  });
});
