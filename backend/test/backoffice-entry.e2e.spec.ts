import "reflect-metadata";
import { createHmac } from "node:crypto";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { BackofficeAuthGuard } from "../src/identity-access/auth/backoffice-auth.guard";
import { BackofficeAuthService } from "../src/identity-access/auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "../src/identity-access/auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { AccessConfig } from "../src/identity-access/config/access-config";
import { BackofficeController } from "../src/identity-access/backoffice.controller";
import { provideAccessConfig } from "../src/identity-access/identity-access.tokens";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";
import { USER_REPOSITORY } from "../src/identity-access/users/user.repository";

describe("Backoffice entry e2e", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("creates an administrator session and allows capability access via signed Telegram entry", async () => {
    const serviceTelegramBotToken = "service-token";
    app = await createTestApp({
      environment: "production",
      adminTelegramId: "1001",
      disableTelegramAuth: false,
      serviceTelegramBotToken
    });

    const initData = signTelegramInitData("1001", serviceTelegramBotToken);

    await request(app.getHttpServer())
      .post("/backoffice/auth/session")
      .send({ initData })
      .expect(201)
      .expect(({ body }) => {
        expect(body.roles).toEqual(["administrator"]);
        expect(body.capabilities).toEqual(["orders", "availability", "menu", "users", "settings"]);
      });

    await request(app.getHttpServer())
      .get("/backoffice/menu")
      .set("x-telegram-init-data", initData)
      .expect(200)
      .expect(({ body }) => {
        expect(body.telegramId).toBe("1001");
        expect(body.capabilities).toContain("menu");
      });
  });

  it("rejects direct production-like capability access without Telegram entry", async () => {
    app = await createTestApp({
      environment: "production",
      adminTelegramId: "1001",
      disableTelegramAuth: false,
      serviceTelegramBotToken: "service-token"
    });

    await request(app.getHttpServer())
      .get("/backoffice/orders")
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe("telegram-init-data-required");
      });
  });

  it("allows test-mode session bootstrap only in test environment", async () => {
    app = await createTestApp({
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true
    });

    await request(app.getHttpServer())
      .post("/backoffice/auth/session")
      .send({})
      .expect(201)
      .expect(({ body }) => {
        expect(body.telegramId).toBe("1001");
        expect(body.capabilities).toEqual(["orders", "availability", "menu", "users", "settings"]);
      });
  });
});

async function createTestApp(config: AccessConfig): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    controllers: [BackofficeController],
    providers: [
      provideAccessConfig(config),
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

function signTelegramInitData(telegramId: string, botToken: string): string {
  const params = new URLSearchParams({
    auth_date: "1710000000",
    user: JSON.stringify({ id: Number(telegramId), first_name: "Admin" })
  });
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const hash = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  params.set("hash", hash);
  return params.toString();
}
