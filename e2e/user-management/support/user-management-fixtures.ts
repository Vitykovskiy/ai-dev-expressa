import type {
  AssignUserRoleResponse,
  UserManagementActor,
  UserManagementListResponse,
  UserManagementUser,
} from "./user-management-types";

export const bootstrapAdministratorTelegramId =
  process.env.E2E_TEST_TELEGRAM_ID ?? "123456789";

export const ordinaryAdministratorTelegramId =
  bootstrapAdministratorTelegramId === "1001" ? "1002" : "1001";

export const baristaTelegramId =
  bootstrapAdministratorTelegramId === "2002" ? "2003" : "2002";

export const administratorCapabilities = [
  "orders",
  "availability",
  "menu",
  "users",
  "settings",
] as const;

export const baristaCapabilities = ["orders", "availability"] as const;

export const bootstrapAdministratorActor: UserManagementActor = {
  userId: "e2e-bootstrap-administrator",
  telegramId: bootstrapAdministratorTelegramId,
  roles: ["administrator"],
  capabilities: administratorCapabilities,
};

export const ordinaryAdministratorActor: UserManagementActor = {
  userId: "e2e-ordinary-administrator",
  telegramId: ordinaryAdministratorTelegramId,
  roles: ["administrator"],
  capabilities: administratorCapabilities,
};

export const baristaActor: UserManagementActor = {
  userId: "e2e-barista",
  telegramId: baristaTelegramId,
  roles: ["barista"],
  capabilities: baristaCapabilities,
};

export const customerUser: UserManagementUser = {
  userId: "e2e-user-customer",
  displayName: "Иван Петров",
  telegramUsername: "@ivan_petrov",
  roles: ["customer"],
  blocked: false,
  availableRoleAssignments: ["barista"],
};

export const bootstrapAssignableUser: UserManagementUser = {
  ...customerUser,
  userId: "e2e-user-bootstrap-assignable",
  displayName: "Мария Соколова",
  telegramUsername: "@maria_sokolova",
  availableRoleAssignments: ["barista", "administrator"],
};

export const assignedBaristaUser: UserManagementUser = {
  ...customerUser,
  roles: ["customer", "barista"],
  availableRoleAssignments: ["barista"],
};

export const assignedAdministratorUser: UserManagementUser = {
  ...bootstrapAssignableUser,
  roles: ["customer", "administrator"],
  availableRoleAssignments: ["barista", "administrator"],
};

export function usersListResponse(
  items: readonly UserManagementUser[] = [customerUser],
): UserManagementListResponse {
  return {
    items,
    meta: {
      total: items.length,
    },
  };
}

export function assignRoleResponse(
  user: UserManagementUser,
): AssignUserRoleResponse {
  const capabilities = user.roles.includes("administrator")
    ? administratorCapabilities
    : user.roles.includes("barista")
      ? baristaCapabilities
      : [];

  return {
    userId: user.userId,
    roles: user.roles,
    backofficeAccess: {
      capabilities,
    },
  };
}
