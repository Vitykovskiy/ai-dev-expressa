import { describe, expect, it } from "vitest";
import { validateRoleAssignmentDraft } from "@/modules/user-management/validation";

describe("validateRoleAssignmentDraft", () => {
  it("accepts a user with a valid assignable role", () => {
    const result = validateRoleAssignmentDraft(
      {
        userId: "usr_1",
        name: "Иван Петров",
        telegramUsername: "@ivan_petrov",
        role: "barista",
      },
      ["barista", "administrator"],
    );

    expect(result.valid).toBe(true);
    expect(result.payload).toEqual({
      userId: "usr_1",
      role: "barista",
    });
  });

  it("requires an identified user with filled mandatory fields", () => {
    const result = validateRoleAssignmentDraft(
      {
        userId: "",
        name: "",
        telegramUsername: "",
        role: "",
      },
      [],
    );

    expect(result.valid).toBe(false);
    expect(result.errors.userId).toBe("Выберите пользователя.");
    expect(result.errors.name).toBe("Укажите имя.");
    expect(result.errors.telegramUsername).toBe("Укажите Telegram Username.");
    expect(result.errors.role).toBe("Выберите роль.");
  });

  it("rejects roles outside server-provided assignments", () => {
    const result = validateRoleAssignmentDraft(
      {
        userId: "usr_1",
        name: "Иван Петров",
        telegramUsername: "@ivan_petrov",
        role: "administrator",
      },
      ["barista"],
    );

    expect(result.valid).toBe(false);
    expect(result.errors.role).toBe("Выберите допустимую роль.");
  });
});
