import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { BackofficeAuthGuard } from "../src/identity-access/auth/backoffice-auth.guard";
import { BackofficeAuthService } from "../src/identity-access/auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "../src/identity-access/auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { BackofficeController } from "../src/identity-access/backoffice.controller";
import { provideAccessConfig } from "../src/identity-access/identity-access.tokens";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";
import { USER_REPOSITORY } from "../src/identity-access/users/user.repository";

describe("BackofficeRoleGuard", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("allows administrator to all backoffice capabilities", async () => {
    app = await createTestApp();

    for (const capability of ["orders", "availability", "menu", "users", "settings"]) {
      await request(app.getHttpServer()).get(`/backoffice/${capability}`).expect(200);
    }
  });

  it("allows barista only orders and availability", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    await identity.ensureUserWithRoles("2002", ["barista"]);

    await request(app.getHttpServer())
      .get("/backoffice/orders")
      .set("x-test-telegram-id", "2002")
      .expect(200);
    await request(app.getHttpServer())
      .get("/backoffice/availability")
      .set("x-test-telegram-id", "2002")
      .expect(200);
    await request(app.getHttpServer())
      .get("/backoffice/menu")
      .set("x-test-telegram-id", "2002")
      .expect(403);
    await request(app.getHttpServer())
      .get("/backoffice/users")
      .set("x-test-telegram-id", "2002")
      .expect(403);
    await request(app.getHttpServer())
      .get("/backoffice/settings")
      .set("x-test-telegram-id", "2002")
      .expect(403);
  });

  it("rejects customer access to backoffice", async () => {
    app = await createTestApp();
    const identity = app.get(IdentityAccessService);
    await identity.ensureUserWithRoles("3003", ["customer"]);

    await request(app.getHttpServer())
      .get("/backoffice/orders")
      .set("x-test-telegram-id", "3003")
      .expect(403);
  });
});

async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    controllers: [BackofficeController],
    providers: [
      provideAccessConfig({
        environment: "test",
        adminTelegramId: "1001",
        disableTelegramAuth: true
      }),
      {
        provide: USER_REPOSITORY,
        useClass: InMemoryUserRepository
      },
      IdentityAccessService,
      BootstrapAdministratorService,
      TelegramInitDataVerifier,
      BackofficeAuthService,
      BackofficeAuthGuard
    ]
  }).compile();

  const testApp = moduleRef.createNestApplication();
  await testApp.init();
  return testApp;
}
