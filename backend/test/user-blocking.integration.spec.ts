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

describe("User blocking", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("FEATURE-005-SC-001 blocks an existing user and preserves target roles", async () => {
    app = await createTestApp();
    const repository = app.get<InMemoryUserRepository>(USER_REPOSITORY);
    const target = await repository.save(
      createUser({
        telegramId: "2002",
        roles: ["customer", "barista"],
      }),
    );

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/block`)
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

    await expect(repository.findByUserId(target.userId)).resolves.toMatchObject(
      {
        roles: ["customer", "barista"],
        blocked: true,
      },
    );
  });

  it("FEATURE-005-SC-002 denies session and capability access for a blocked user", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    const target = await identity.ensureUserWithRoles("2002", ["barista"]);

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/block`)
      .expect(200);

    await request(app.getHttpServer())
      .post("/backoffice/auth/session")
      .send({ testTelegramId: "2002" })
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("user-blocked");
      });

    await request(app.getHttpServer())
      .get("/backoffice/orders")
      .set("x-test-telegram-id", "2002")
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("user-blocked");
      });

    await request(app.getHttpServer()).get("/backoffice/users").expect(200);
  });

  it("FEATURE-005-SC-003 rejects block operation for non administrator and keeps target unchanged", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    const target = await identity.ensureUserWithRoles("2002", ["customer"]);
    await identity.ensureUserWithRoles("3003", ["barista"]);

    await request(app.getHttpServer())
      .patch(`/backoffice/user-management/users/${target.userId}/block`)
      .set("x-test-telegram-id", "3003")
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("administrator-role-required");
      });

    await expect(identity.findByTelegramId("2002")).resolves.toMatchObject({
      blocked: false,
    });
  });

  it("FEATURE-005-SC-004 returns user-not-found for a missing target", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .patch("/backoffice/user-management/users/missing-user/block")
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe("user-not-found");
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
