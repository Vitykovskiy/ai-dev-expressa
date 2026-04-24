import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { toAuthenticatedActor } from "../src/identity-access/domain/authenticated-actor";
import { createUser } from "../src/identity-access/domain/user";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { UsersService } from "../src/identity-access/users/users.service";

describe("UsersService", () => {
  it("reads users with available role assignments for bootstrap administrator", async () => {
    const repository = new InMemoryUserRepository();
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer", "barista"],
      }),
    );
    await repository.save(
      createUser({
        userId: "usr_2",
        telegramId: "2002",
        displayName: "Maria Ivanova",
        telegramUsername: "@maria_ivanova",
        roles: ["customer"],
        blocked: true,
      }),
    );

    const service = new UsersService(repository, {
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(
      service.readUsers(
        toAuthenticatedActor(
          createUser({
            userId: "usr_admin",
            telegramId: "1001",
            roles: ["administrator"],
          }),
        ),
        {
          search: "ivan",
          role: "barista",
          blocked: "false",
        },
      ),
    ).resolves.toEqual({
      items: [
        {
          userId: "usr_1",
          displayName: "Ivan Petrov",
          telegramUsername: "@ivan_petrov",
          roles: ["customer", "barista"],
          blocked: false,
          availableRoleAssignments: ["barista", "administrator"],
        },
      ],
      meta: {
        total: 1,
      },
    });
  });

  it("assigns barista role and recalculates backoffice access", async () => {
    const repository = new InMemoryUserRepository();
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    const service = new UsersService(repository, {
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(
      service.assignRole(
        toAuthenticatedActor(
          createUser({
            userId: "usr_admin",
            telegramId: "1001",
            roles: ["administrator"],
          }),
        ),
        "usr_1",
        { role: "barista" },
      ),
    ).resolves.toEqual({
      userId: "usr_1",
      roles: ["customer", "barista"],
      backofficeAccess: {
        capabilities: ["orders", "availability"],
      },
    });
  });

  it("assigns administrator role for bootstrap administrator", async () => {
    const repository = new InMemoryUserRepository();
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    const service = new UsersService(repository, {
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(
      service.assignRole(
        toAuthenticatedActor(
          createUser({
            userId: "usr_admin",
            telegramId: "1001",
            roles: ["administrator"],
          }),
        ),
        "usr_1",
        { role: "administrator" },
      ),
    ).resolves.toEqual({
      userId: "usr_1",
      roles: ["customer", "administrator"],
      backofficeAccess: {
        capabilities: ["orders", "availability", "menu", "users", "settings"],
      },
    });
  });

  it("rejects assigning administrator role for a non-bootstrap administrator", async () => {
    const repository = new InMemoryUserRepository();
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    const service = new UsersService(repository, {
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(
      service.assignRole(
        toAuthenticatedActor(
          createUser({
            userId: "usr_admin",
            telegramId: "9999",
            roles: ["administrator"],
          }),
        ),
        "usr_1",
        { role: "administrator" },
      ),
    ).rejects.toMatchObject({
      response: {
        message: "administrator-role-assignment-forbidden",
      },
    });
  });

  it("rejects assigning role for non-administrator actor", async () => {
    const repository = new InMemoryUserRepository();
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    const service = new UsersService(repository, {
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(
      service.assignRole(
        toAuthenticatedActor(
          createUser({
            userId: "usr_customer",
            telegramId: "3001",
            roles: ["customer"],
          }),
        ),
        "usr_1",
        { role: "barista" },
      ),
    ).rejects.toMatchObject({
      response: {
        message: "administrator-role-required",
      },
    });
  });

  it("returns user-not-found when target user is absent", async () => {
    const repository = new InMemoryUserRepository();
    const service = new UsersService(repository, {
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(
      service.assignRole(
        toAuthenticatedActor(
          createUser({
            userId: "usr_admin",
            telegramId: "1001",
            roles: ["administrator"],
          }),
        ),
        "missing-user",
        { role: "barista" },
      ),
    ).rejects.toMatchObject({
      response: {
        message: "user-not-found",
      },
    });
  });
});
