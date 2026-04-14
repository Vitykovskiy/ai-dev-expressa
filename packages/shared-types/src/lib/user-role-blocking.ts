export const systemRoleValues = ["customer", "barista", "administrator"] as const;
export type SystemRole = (typeof systemRoleValues)[number];

export const assignableBackofficeRoleValues = ["barista", "administrator"] as const;
export type AssignableBackofficeRole = (typeof assignableBackofficeRoleValues)[number];

export const backofficeTabValues = [
  "orders",
  "availability",
  "menu",
  "users",
  "settings"
] as const;
export type BackofficeTab = (typeof backofficeTabValues)[number];

export interface UserRecordDto {
  userId: string;
  telegramId: string;
  roles: SystemRole[];
  blocked: boolean;
  isBootstrapAdministrator: boolean;
  availableTabs: BackofficeTab[];
}

export interface ListUsersResponseDto {
  users: UserRecordDto[];
}

export interface AssignUserRoleRequestDto {
  targetTelegramId: string;
  role: AssignableBackofficeRole;
}

export interface BlockUserRequestDto {
  targetTelegramId: string;
}

export interface UserMutationResponseDto {
  user: UserRecordDto;
}

