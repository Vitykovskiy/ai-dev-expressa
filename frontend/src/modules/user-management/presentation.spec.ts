import { describe, expect, it } from "vitest";
import {
  buildRoleAssignmentDraft,
  getPrimaryRoleLabel,
  getUserInitials,
  mapUserRoleAssignmentError,
  mergeRoleAssignmentErrors,
} from "@/modules/user-management/presentation";
import { createEmptyRoleAssignmentErrors } from "@/modules/user-management/validation";
import type { UserSummary } from "@/modules/user-management/types";

const administratorUser: UserSummary = {
  userId: "usr_1",
  displayName: "Иван Петров",
  telegramUsername: "@ivan_petrov",
  roles: ["customer", "administrator"],
  blocked: false,
  availableRoleAssignments: ["barista", "administrator"],
};

describe("user management presentation helpers", () => {
  it("builds dialog draft from a selected user", () => {
    expect(
      buildRoleAssignmentDraft(administratorUser, "administrator"),
    ).toEqual({
      userId: "usr_1",
      name: "Иван Петров",
      telegramUsername: "@ivan_petrov",
      role: "administrator",
    });
  });

  it("maps the administrator assignment guard to a form error", () => {
    expect(
      mapUserRoleAssignmentError("administrator-role-assignment-forbidden")
        .formError,
    ).toBe("Роль администратора может назначать только главный администратор.");
  });

  it("merges backend and local field errors without losing untouched fields", () => {
    const merged = mergeRoleAssignmentErrors(
      createEmptyRoleAssignmentErrors(),
      {
        role: "Выбранная роль недоступна для назначения.",
      },
    );

    expect(merged.role).toBe("Выбранная роль недоступна для назначения.");
    expect(merged.name).toBeNull();
  });

  it("derives compact initials and primary role label", () => {
    expect(getUserInitials("Иван Петров")).toBe("ИП");
    expect(getPrimaryRoleLabel(administratorUser)).toBe("Администратор");
  });
});
