import { SessionViewMapper } from "../../src/modules/auth-session/session-view.mapper";

describe("SessionViewMapper", () => {
  it("maps administrator tabs into session DTO", () => {
    const mapper = new SessionViewMapper();

    const dto = mapper.toDto({
      user: {
        userId: "1",
        telegramId: "100",
        roles: ["administrator"],
        blocked: false,
        isBootstrapAdministrator: true
      },
      accessChannel: "test-mode-without-telegram",
      testMode: true
    });

    expect(dto.user.availableTabs).toEqual([
      "orders",
      "availability",
      "menu",
      "users",
      "settings"
    ]);
    expect(dto.testMode).toBe(true);
  });
});

