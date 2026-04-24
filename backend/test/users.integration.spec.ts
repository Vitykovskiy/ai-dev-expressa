import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { BackofficeAuthGuard } from "../src/identity-access/auth/backoffice-auth.guard";
import { BackofficeAuthService } from "../src/identity-access/auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "../src/identity-access/auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { BackofficeController } from "../src/identity-access/backoffice.controller";
import { createUser } from "../src/identity-access/domain/user";
import { provideAccessConfig } from "../src/identity-access/identity-access.tokens";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";
import { USER_REPOSITORY } from "../src/identity-access/users/user.repository";
import { UsersController } from "../src/identity-access/users/users.controller";
import { UsersService } from "../src/identity-access/users/users.service";

describe("Users integration", () => {
  let app: INestApplication | undefined;
  let repository: InMemoryUserRepository | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
    repository = undefined;
  });

  it("FTS-004-001 FTS-004-003 returns the filtered users list", async () => {
    ({ app, repository } = await createTestApp());
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

    await request(app.getHttpServer())
      .get("/backoffice/users")
      .set("x-test-telegram-id", "1001")
      .query({
        search: "ivan",
        role: "barista",
        blocked: "false",
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
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
  });

  it("FTS-004-002 assigns barista role through HTTP contract", async () => {
    ({ app, repository } = await createTestApp());
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    await request(app.getHttpServer())
      .patch("/backoffice/users/usr_1/role")
      .set("x-test-telegram-id", "1001")
      .send({ role: "barista" })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          userId: "usr_1",
          roles: ["customer", "barista"],
          backofficeAccess: {
            capabilities: ["orders", "availability"],
          },
        });
      });
  });

  it("FTS-004-005 rejects an invalid assignable role", async () => {
    ({ app, repository } = await createTestApp());
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    await request(app.getHttpServer())
      .patch("/backoffice/users/usr_1/role")
      .set("x-test-telegram-id", "1001")
      .send({ role: "customer" })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message).toBe("role-not-assignable");
      });
  });

  it("FTS-004-006 rejects role assignment for actor without users capability", async () => {
    ({ app, repository } = await createTestApp());
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );
    await repository.save(
      createUser({
        userId: "usr_barista",
        telegramId: "2002",
        displayName: "Barista User",
        telegramUsername: "@barista_user",
        roles: ["barista"],
      }),
    );

    await request(app.getHttpServer())
      .patch("/backoffice/users/usr_1/role")
      .set("x-test-telegram-id", "2002")
      .send({ role: "barista" })
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("backoffice-capability-forbidden");
      });
  });

  it("FTS-004-007 assigns administrator role for bootstrap administrator", async () => {
    ({ app, repository } = await createTestApp());
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );

    await request(app.getHttpServer())
      .patch("/backoffice/users/usr_1/role")
      .set("x-test-telegram-id", "1001")
      .send({ role: "administrator" })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          userId: "usr_1",
          roles: ["customer", "administrator"],
          backofficeAccess: {
            capabilities: [
              "orders",
              "availability",
              "menu",
              "users",
              "settings",
            ],
          },
        });
      });
  });

  it("FTS-004-008 rejects assigning administrator role for a non-bootstrap administrator", async () => {
    ({ app, repository } = await createTestApp());
    await repository.save(
      createUser({
        userId: "usr_1",
        telegramId: "2001",
        displayName: "Ivan Petrov",
        telegramUsername: "@ivan_petrov",
        roles: ["customer"],
      }),
    );
    await repository.save(
      createUser({
        userId: "usr_2",
        telegramId: "2002",
        displayName: "Secondary Admin",
        telegramUsername: "@secondary_admin",
        roles: ["administrator"],
      }),
    );

    await request(app.getHttpServer())
      .patch("/backoffice/users/usr_1/role")
      .set("x-test-telegram-id", "2002")
      .send({ role: "administrator" })
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("administrator-role-assignment-forbidden");
      });
  });

  it("returns user-not-found when target user does not exist", async () => {
    ({ app } = await createTestApp());

    await request(app.getHttpServer())
      .patch("/backoffice/users/missing-user/role")
      .set("x-test-telegram-id", "1001")
      .send({ role: "barista" })
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe("user-not-found");
      });
  });
});

async function createTestApp(): Promise<{
  app: INestApplication;
  repository: InMemoryUserRepository;
}> {
  const repository = new InMemoryUserRepository();
  const moduleRef = await Test.createTestingModule({
    controllers: [UsersController, BackofficeController],
    providers: [
      provideAccessConfig({
        environment: "test",
        adminTelegramId: "1001",
        disableTelegramAuth: true,
      }),
      {
        provide: USER_REPOSITORY,
        useValue: repository,
      },
      Reflector,
      IdentityAccessService,
      UsersService,
      BootstrapAdministratorService,
      TelegramInitDataVerifier,
      BackofficeAuthService,
      BackofficeAuthGuard,
    ],
  }).compile();

  const testApp = moduleRef.createNestApplication();
  await testApp.init();

  return {
    app: testApp,
    repository,
  };
}
