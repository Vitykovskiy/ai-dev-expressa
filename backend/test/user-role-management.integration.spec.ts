import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { BackofficeAuthGuard } from "../src/identity-access/auth/backoffice-auth.guard";
import { BackofficeAuthService } from "../src/identity-access/auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "../src/identity-access/auth/telegram-init-data.verifier";
import { BackofficeController } from "../src/identity-access/backoffice.controller";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { createUser } from "../src/identity-access/domain/user";
import { provideAccessConfig } from "../src/identity-access/identity-access.tokens";
import { UserManagementController } from "../src/identity-access/user-management.controller";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";
import { USER_REPOSITORY } from "../src/identity-access/users/user.repository";

describe("User role management", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("F004-SC-001 returns managed users for administrator", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    const target = await identity.ensureUserWithRoles("2002", ["customer"]);

    await request(app.getHttpServer())
      .get("/backoffice/user-management/users")
      .expect(200)
      .expect(({ body }) => {
        expect(body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              userId: target.userId,
              telegramId: "2002",
              roles: ["customer"],
              blocked: false,
              capabilities: [],
            }),
          ]),
        );
      });
  });

  it("F004-SC-003 assigns barista role and preserves customer and blocked state", async () => {
    app = await createTestApp();
    const repository = app.get<InMemoryUserRepository>(USER_REPOSITORY);
    const target = await repository.save(
      createUser({
        telegramId: "2002",
        roles: ["customer"],
        blocked: true,
      }),
    );

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/role`)
      .send({ assignedRole: "barista" })
      .expect(200)
      .expect(({ body }) => {
        expect(body.user).toMatchObject({
          userId: target.userId,
          telegramId: "2002",
          roles: ["customer", "barista"],
          blocked: true,
          capabilities: ["orders", "availability"],
        });
      });
  });

  it("F004-SC-005 rejects user management for non administrator", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    const target = await identity.ensureUserWithRoles("3003", ["customer"]);
    await identity.ensureUserWithRoles("2002", ["barista"]);

    await request(app.getHttpServer())
      .get("/backoffice/user-management/users")
      .set("x-test-telegram-id", "2002")
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("administrator-role-required");
      });

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/role`)
      .set("x-test-telegram-id", "2002")
      .send({ assignedRole: "barista" })
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("administrator-role-required");
      });
  });

  it("F004-SC-006 rejects invalid assigned role and keeps target roles unchanged", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    const target = await identity.ensureUserWithRoles("2002", ["customer"]);

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/role`)
      .send({ assignedRole: "customer" })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe("role-not-assignable");
      });

    await expect(identity.findByTelegramId("2002")).resolves.toMatchObject({
      roles: ["customer"],
    });
  });

  it("returns documented user-not-found error for stale target user", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .patch("/backoffice/user-management/users/missing-user/role")
      .send({ assignedRole: "barista" })
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe("user-not-found");
      });
  });

  it("F004-SC-007 limits administrator assignment to main administrator", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    await identity.ensureUserWithRoles("2002", ["administrator"]);
    const target = await identity.ensureUserWithRoles("3003", ["customer"]);

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/role`)
      .set("x-test-telegram-id", "2002")
      .send({ assignedRole: "administrator" })
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("main-administrator-required");
      });

    await expect(identity.findByTelegramId("3003")).resolves.toMatchObject({
      roles: ["customer"],
    });

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/role`)
      .send({ assignedRole: "administrator" })
      .expect(200)
      .expect(({ body }) => {
        expect(body.user).toMatchObject({
          userId: target.userId,
          telegramId: "3003",
          roles: ["customer", "administrator"],
          capabilities: ["orders", "availability", "menu", "users", "settings"],
        });
      });
  });
});

async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    controllers: [BackofficeController, UserManagementController],
    providers: [
      provideAccessConfig({
        environment: "test",
        adminTelegramId: "1001",
        disableTelegramAuth: true,
      }),
      {
        provide: USER_REPOSITORY,
        useClass: InMemoryUserRepository,
      },
      IdentityAccessService,
      BootstrapAdministratorService,
      TelegramInitDataVerifier,
      BackofficeAuthService,
      BackofficeAuthGuard,
    ],
  }).compile();

  const testApp = moduleRef.createNestApplication();
  await testApp.init();
  return testApp;
}
