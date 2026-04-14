import { InMemoryUserRepository } from "../../src/modules/persistence/in-memory/in-memory-user.repository";
import { AdministratorAssignmentPolicy } from "../../src/modules/identity-access/administrator-assignment.policy";
import { IdentityAccessService } from "../../src/modules/identity-access/identity-access.service";
import { UserViewMapper } from "../../src/modules/identity-access/user-view.mapper";

describe("IdentityAccessService", () => {
  it("creates missing target user when assigning a role", async () => {
    const repository = new InMemoryUserRepository();
    const actor = await repository.create({
      telegramId: "100",
      roles: ["administrator"],
      isBootstrapAdministrator: true
    });
    const service = new IdentityAccessService(
      repository,
      new AdministratorAssignmentPolicy({
        administratorPromotionMode: "bootstrap-only"
      } as never),
      new UserViewMapper()
    );

    const response = await service.assignRole(
      {
        user: actor,
        accessChannel: "test-mode-without-telegram",
        testMode: true
      },
      {
        targetTelegramId: "200",
        role: "barista"
      }
    );

    expect(response.user.telegramId).toBe("200");
    expect(response.user.roles).toEqual(["barista"]);
    expect(response.user.availableTabs).toEqual(["orders", "availability"]);
  });
});

