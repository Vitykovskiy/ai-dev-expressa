import { describe, expect, it } from "vitest";
import {
  canAssignRole,
  getAssignableRoleLabel,
  getAssignableRoleOptions,
  getFirstAssignableRole,
} from "@/modules/user-management/access";
import type { UserSummary } from "@/modules/user-management/types";

const bootstrapCandidate: UserSummary = {
  userId: "usr_1",
  displayName: "Иван Петров",
  telegramUsername: "@ivan_petrov",
  roles: ["customer"],
  blocked: false,
  availableRoleAssignments: ["barista", "administrator"],
};

describe("user management access helpers", () => {
  it("maps available assignments to select options", () => {
    expect(getAssignableRoleOptions(bootstrapCandidate)).toEqual([
      { value: "barista", label: "Бариста" },
      { value: "administrator", label: "Администратор" },
    ]);
  });

  it("returns the first assignable role for the dialog default", () => {
    expect(getFirstAssignableRole(bootstrapCandidate)).toBe("barista");
    expect(getFirstAssignableRole(null)).toBe("");
  });

  it("knows whether a user can enter the assignment flow", () => {
    expect(canAssignRole(bootstrapCandidate)).toBe(true);
    expect(
      canAssignRole({
        ...bootstrapCandidate,
        availableRoleAssignments: [],
      }),
    ).toBe(false);
  });

  it("keeps stable labels for roles", () => {
    expect(getAssignableRoleLabel("barista")).toBe("Бариста");
    expect(getAssignableRoleLabel("administrator")).toBe("Администратор");
  });
});
