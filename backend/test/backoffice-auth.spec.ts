import "reflect-metadata";
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { BackofficeAuthService } from "../src/identity-access/auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "../src/identity-access/auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { AccessConfig } from "../src/identity-access/config/access-config";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";

describe("BackofficeAuthService", () => {
  it("allows test-mode bypass for bootstrapped administrator in test environment", async () => {
    const { auth } = await setup({
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true,
    });

    await expect(auth.authenticate({})).resolves.toMatchObject({
      telegramId: "1001",
      roles: ["administrator"],
      capabilities: ["orders", "availability", "menu", "users", "settings"],
    });
  });

  it("rejects direct access when Telegram auth is enabled", async () => {
    const { auth } = await setup({
      environment: "production",
      adminTelegramId: "1001",
      disableTelegramAuth: false,
      serviceTelegramBotToken: "service-token",
    });

    await expect(auth.authenticate({})).rejects.toMatchObject({
      response: { message: "telegram-init-data-required" },
    });
  });

  it("accepts signed Telegram Web App initData for service bot entry", async () => {
    const serviceTelegramBotToken = "service-token";
    const { auth } = await setup({
      environment: "production",
      adminTelegramId: "1001",
      disableTelegramAuth: false,
      serviceTelegramBotToken,
    });

    await expect(
      auth.authenticate({
        initData: signTelegramInitData("1001", serviceTelegramBotToken),
      }),
    ).resolves.toMatchObject({
      telegramId: "1001",
      roles: ["administrator"],
    });
  });

  it("rejects tampered Telegram initData", async () => {
    const { auth } = await setup({
      environment: "production",
      adminTelegramId: "1001",
      disableTelegramAuth: false,
      serviceTelegramBotToken: "service-token",
    });

    await expect(
      auth.authenticate({
        initData: `${signTelegramInitData("1001", "service-token")}&extra=tampered`,
      }),
    ).rejects.toMatchObject({
      response: { message: "telegram-hash-invalid" },
    });
  });
});

async function setup(
  config: AccessConfig,
): Promise<{ auth: BackofficeAuthService }> {
  const identity = new IdentityAccessService(new InMemoryUserRepository());
  await new BootstrapAdministratorService(config, identity).bootstrap();
  return {
    auth: new BackofficeAuthService(
      config,
      identity,
      new TelegramInitDataVerifier(),
    ),
  };
}

function signTelegramInitData(telegramId: string, botToken: string): string {
  const params = new URLSearchParams({
    auth_date: "1710000000",
    user: JSON.stringify({ id: Number(telegramId), first_name: "Admin" }),
  });
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const hash = createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");
  params.set("hash", hash);
  return params.toString();
}
