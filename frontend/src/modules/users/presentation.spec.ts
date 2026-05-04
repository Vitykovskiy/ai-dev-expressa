import { describe, expect, it } from "vitest";
import {
  filterUserManagementUsers,
  getAssignableRoleInitialValue,
  getPrimaryOperationalRole,
  getUsersBlockSuccessMessage,
  getUserDisplayLabel,
  getUserInitials,
  getUserTelegramLabel,
  isUserBlockActionDisabled,
  mapUserManagementBlockError,
  mapUserManagementAssignError,
  mapUserManagementLoadError,
  resolveUserRoleBadge,
  resolveUserStatusBadge,
} from "@/modules/users/presentation";
import type { UserManagementUser } from "@/modules/users/types";

const users: readonly UserManagementUser[] = [
  {
    userId: "u-1",
    telegramId: "ivan",
    displayLabel: "Иван Петров",
    roles: ["customer", "barista"],
    blocked: false,
  },
  {
    userId: "u-2",
    telegramId: "1002",
    displayLabel: "Анна",
    roles: ["administrator"],
    blocked: false,
  },
  {
    userId: "u-3",
    telegramId: "1003",
    displayLabel: null,
    roles: ["customer"],
    blocked: true,
  },
];

describe("users presentation helpers", () => {
  it("filters users by query, role and blocked state", () => {
    expect(filterUserManagementUsers(users, "all", "иван")).toEqual([users[0]]);
    expect(filterUserManagementUsers(users, "barista", "")).toEqual([users[0]]);
    expect(filterUserManagementUsers(users, "blocked", "")).toEqual([users[2]]);
  });

  it("resolves operational roles and badges", () => {
    expect(getPrimaryOperationalRole(["customer", "barista"])).toBe("barista");
    expect(getPrimaryOperationalRole(["administrator"])).toBe("administrator");
    expect(getAssignableRoleInitialValue(["customer"])).toBe("barista");
    expect(resolveUserRoleBadge(["customer"]).label).toBe("Клиент");
    expect(resolveUserRoleBadge(["administrator"]).label).toBe("Администратор");
    expect(resolveUserStatusBadge(true).label).toBe("Заблокирован");
  });

  it("formats labels for rows and dialog user summary", () => {
    expect(getUserDisplayLabel(users[0])).toBe("Иван Петров");
    expect(getUserDisplayLabel(users[2])).toBe("Telegram 1003");
    expect(getUserTelegramLabel(users[0])).toBe("@ivan");
    expect(getUserInitials(users[0])).toBe("ИП");
  });

  it("maps documented load and assign errors", () => {
    expect(mapUserManagementLoadError("administrator-role-required")).toContain(
      "администратору",
    );
    expect(mapUserManagementAssignError("main-administrator-required")).toBe(
      "Назначить роль администратора может только главный администратор.",
    );
    expect(mapUserManagementAssignError(null)).toBeNull();
  });

  it("maps block operation success and documented errors", () => {
    expect(getUsersBlockSuccessMessage(users[0])).toBe(
      'Пользователь "Иван Петров" заблокирован',
    );
    expect(
      mapUserManagementBlockError("administrator-role-required"),
    ).toContain("администратору");
    expect(mapUserManagementBlockError("user-not-found")).toContain(
      "Обновите список",
    );
    expect(mapUserManagementBlockError(null)).toBeNull();
  });

  it("keeps block action enabled for active target users", () => {
    expect(isUserBlockActionDisabled(users[0], null)).toBe(false);
    expect(isUserBlockActionDisabled(users[0], "u-1")).toBe(true);
    expect(isUserBlockActionDisabled(users[2], null)).toBe(true);
  });
});
