export type UserRole = 'customer' | 'barista' | 'administrator';

export type BackofficeTab =
  | 'orders'
  | 'availability'
  | 'menu'
  | 'users'
  | 'settings';

export type BackofficeAccessChannel =
  | 'backoffice-telegram-entry'
  | 'test-mode-without-telegram';

export type BackofficeBootstrapMode = 'telegram' | 'test';

export type BackofficeAccessDenyReason =
  | 'telegram-context-required'
  | 'telegram-context-invalid'
  | 'test-mode-disabled'
  | 'test-telegram-id-required'
  | 'user-not-found'
  | 'backoffice-role-required'
  | 'user-blocked'
  | 'access-token-required'
  | 'access-token-invalid'
  | 'administrator-role-required';

export interface BackofficeAccessBootstrapRequest {
  mode: BackofficeBootstrapMode;
  telegramInitData?: string;
  testTelegramId?: string;
}

export interface BackofficeAccessUser {
  userId: string;
  telegramId: string;
  roles: UserRole[];
  blocked: boolean;
  isPrimaryAdministrator: boolean;
}

export interface BackofficeAccessBootstrapResponse {
  accessToken: string;
  channel: BackofficeAccessChannel;
  isTestMode: boolean;
  availableTabs: BackofficeTab[];
  user: BackofficeAccessUser;
}

export interface BackofficeAccessDeniedResponse {
  statusCode: number;
  reason: BackofficeAccessDenyReason;
  message: string;
}
