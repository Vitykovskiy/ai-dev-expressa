import type { BackofficeTab, SystemRole } from "./user-role-blocking";

export const accessChannelValues = [
  "backoffice-telegram-entry",
  "test-mode-without-telegram"
] as const;
export type AccessChannel = (typeof accessChannelValues)[number];

export interface SessionUserDto {
  userId: string;
  telegramId: string;
  roles: SystemRole[];
  blocked: boolean;
  isBootstrapAdministrator: boolean;
  availableTabs: BackofficeTab[];
}

export interface AuthSessionDto {
  user: SessionUserDto;
  accessChannel: AccessChannel;
  testMode: boolean;
}

