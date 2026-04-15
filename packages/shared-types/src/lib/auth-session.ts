export const AUTH_SESSION_BOOTSTRAP_MODES = ['telegram-webapp', 'test-mode'] as const;
export const USER_ROLES = ['customer', 'barista', 'administrator'] as const;
export const ACCESS_CHANNELS = [
  'backoffice-telegram-entry',
  'test-mode-without-telegram',
] as const;
export const AUTH_SESSION_RESULT_KINDS = [
  'authenticated',
  'denied',
  'blocked',
] as const;
export const AUTH_SESSION_DENIED_CODES = [
  'administrator-role-required',
  'telegram-entry-required',
  'test-mode-disabled',
] as const;

export type AuthSessionBootstrapMode = (typeof AUTH_SESSION_BOOTSTRAP_MODES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type AccessChannel = (typeof ACCESS_CHANNELS)[number];
export type AuthSessionResultKind = (typeof AUTH_SESSION_RESULT_KINDS)[number];
export type AuthSessionDeniedCode = (typeof AUTH_SESSION_DENIED_CODES)[number];

export interface TelegramAuthSessionBootstrapRequest {
  initData: string;
  mode: 'telegram-webapp';
}

export interface TestModeAuthSessionBootstrapRequest {
  mode: 'test-mode';
}

export type AuthSessionBootstrapRequest =
  | TelegramAuthSessionBootstrapRequest
  | TestModeAuthSessionBootstrapRequest;

export interface AuthSessionUserSnapshot {
  displayName: string;
  roles: UserRole[];
  telegramId: string;
}

export interface AdministratorSession extends AuthSessionUserSnapshot {
  accessChannel: AccessChannel;
  userId: string;
}

export interface AuthenticatedAuthSessionBootstrapResponse {
  kind: 'authenticated';
  session: AdministratorSession;
}

export interface DeniedAuthSessionBootstrapResponse {
  code: AuthSessionDeniedCode;
  kind: 'denied';
  user: AuthSessionUserSnapshot | null;
}

export interface BlockedAuthSessionBootstrapResponse {
  code: 'blocked-user';
  kind: 'blocked';
  user: AuthSessionUserSnapshot;
}

export type AuthSessionBootstrapResponse =
  | AuthenticatedAuthSessionBootstrapResponse
  | DeniedAuthSessionBootstrapResponse
  | BlockedAuthSessionBootstrapResponse;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOneOf<T extends readonly string[]>(
  value: unknown,
  expectedValues: T,
): value is T[number] {
  return typeof value === 'string' && expectedValues.includes(value);
}

function isUserRoleArray(value: unknown): value is UserRole[] {
  return Array.isArray(value) && value.every((item) => isOneOf(item, USER_ROLES));
}

export function isAuthSessionBootstrapRequest(
  value: unknown,
): value is AuthSessionBootstrapRequest {
  if (!isObjectRecord(value) || !isOneOf(value.mode, AUTH_SESSION_BOOTSTRAP_MODES)) {
    return false;
  }

  if (value.mode === 'telegram-webapp') {
    return typeof value.initData === 'string' && value.initData.length > 0;
  }

  return true;
}

export function isAuthSessionUserSnapshot(
  value: unknown,
): value is AuthSessionUserSnapshot {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.displayName === 'string'
    && isUserRoleArray(value.roles)
    && typeof value.telegramId === 'string'
  );
}

export function isAdministratorSession(
  value: unknown,
): value is AdministratorSession {
  if (!isAuthSessionUserSnapshot(value) || !isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.userId === 'string'
    && value.roles.includes('administrator')
    && isOneOf(value.accessChannel, ACCESS_CHANNELS)
  );
}

export function isAuthSessionBootstrapResponse(
  value: unknown,
): value is AuthSessionBootstrapResponse {
  if (!isObjectRecord(value) || !isOneOf(value.kind, AUTH_SESSION_RESULT_KINDS)) {
    return false;
  }

  switch (value.kind) {
    case 'authenticated':
      return isAdministratorSession(value.session);
    case 'denied':
      return (
        isOneOf(value.code, AUTH_SESSION_DENIED_CODES)
        && (value.user === null || isAuthSessionUserSnapshot(value.user))
      );
    case 'blocked':
      return value.code === 'blocked-user' && isAuthSessionUserSnapshot(value.user);
    default:
      return false;
  }
}
