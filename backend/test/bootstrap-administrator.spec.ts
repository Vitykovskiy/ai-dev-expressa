import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { afterEach, describe, expect, it } from "vitest";
import {
  BootstrapAdministratorService,
  MANUAL_QA_BARISTA_TELEGRAM_ID,
} from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { AccessConfig } from "../src/identity-access/config/access-config";
import { provideAccessConfig } from "../src/identity-access/identity-access.tokens";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";
import { USER_REPOSITORY } from "../src/identity-access/users/user.repository";

let moduleRef: TestingModule | undefined;

describe("BootstrapAdministratorService", () => {
  afterEach(async () => {
    await moduleRef?.close();
    moduleRef = undefined;
  });

  it("creates administrator idempotently from ADMIN_TELEGRAM_ID", async () => {
    const { bootstrap, identity } = await setup({
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await bootstrap.bootstrap();
    const first = await identity.findByTelegramId("1001");
    await bootstrap.bootstrap();
    const second = await identity.findByTelegramId("1001");

    expect(first?.userId).toBe(second?.userId);
    expect(second?.roles).toEqual(["administrator"]);
  });

  it("does not duplicate administrator role for an existing user", async () => {
    const { bootstrap, identity } = await setup({
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });
    await identity.ensureUserWithRoles("1001", ["customer"]);

    await bootstrap.bootstrap();
    await bootstrap.bootstrap();

    await expect(identity.findByTelegramId("1001")).resolves.toMatchObject({
      telegramId: "1001",
      roles: ["customer", "administrator"],
    });
  });

  it("creates the manual QA barista fixture only for disabled-auth test mode", async () => {
    const { bootstrap, identity } = await setup({
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await bootstrap.bootstrap();
    await bootstrap.bootstrap();

    await expect(
      identity.findByTelegramId(MANUAL_QA_BARISTA_TELEGRAM_ID),
    ).resolves.toMatchObject({
      telegramId: MANUAL_QA_BARISTA_TELEGRAM_ID,
      roles: ["barista"],
    });
  });

  it("does not create the manual QA barista fixture when Telegram auth is enabled", async () => {
    const { bootstrap, identity } = await setup({
      environment: "production",
      adminTelegramId: "1001",
      disableTelegramAuth: false,
      serviceTelegramBotToken: "service-token",
    });

    await bootstrap.bootstrap();

    await expect(
      identity.findByTelegramId(MANUAL_QA_BARISTA_TELEGRAM_ID),
    ).resolves.toBeUndefined();
  });
});

async function setup(config: AccessConfig): Promise<{
  bootstrap: BootstrapAdministratorService;
  identity: IdentityAccessService;
}> {
  moduleRef = await Test.createTestingModule({
    providers: [
      provideAccessConfig(config),
      {
        provide: USER_REPOSITORY,
        useClass: InMemoryUserRepository,
      },
      IdentityAccessService,
      BootstrapAdministratorService,
    ],
  }).compile();

  return {
    bootstrap: moduleRef.get(BootstrapAdministratorService),
    identity: moduleRef.get(IdentityAccessService),
  };
}
