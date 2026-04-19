import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";

describe("BootstrapAdministratorService", () => {
  it("creates administrator idempotently from ADMIN_TELEGRAM_ID", async () => {
    const repository = new InMemoryUserRepository();
    const identity = new IdentityAccessService(repository);
    const bootstrap = new BootstrapAdministratorService(
      {
        environment: "test",
        adminTelegramId: "1001",
        disableTelegramAuth: true
      },
      identity
    );

    await bootstrap.bootstrap();
    const first = await identity.findByTelegramId("1001");
    await bootstrap.bootstrap();
    const second = await identity.findByTelegramId("1001");

    expect(first?.userId).toBe(second?.userId);
    expect(second?.roles).toEqual(["administrator"]);
  });

  it("does not duplicate administrator role for an existing user", async () => {
    const repository = new InMemoryUserRepository();
    const identity = new IdentityAccessService(repository);
    await identity.ensureUserWithRoles("1001", ["customer"]);

    const bootstrap = new BootstrapAdministratorService(
      {
        environment: "test",
        adminTelegramId: "1001",
        disableTelegramAuth: true
      },
      identity
    );

    await bootstrap.bootstrap();
    await bootstrap.bootstrap();

    await expect(identity.findByTelegramId("1001")).resolves.toMatchObject({
      telegramId: "1001",
      roles: ["customer", "administrator"]
    });
  });
});
