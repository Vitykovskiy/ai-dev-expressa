export const BACKOFFICE_CAPABILITIES = [
  "orders",
  "availability",
  "menu",
  "users",
  "settings"
] as const;

export type BackofficeCapability = (typeof BACKOFFICE_CAPABILITIES)[number];

export const ROLES = ["customer", "barista", "administrator"] as const;

export type Role = (typeof ROLES)[number];

export interface AuthenticatedActor {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly Role[];
  readonly capabilities: readonly BackofficeCapability[];
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "denied";

export interface SessionState {
  status: AuthStatus;
  actor: AuthenticatedActor | null;
  errorCode: string | null;
}

export interface SessionPayload {
  readonly initData?: string;
  readonly testTelegramId?: string;
}
