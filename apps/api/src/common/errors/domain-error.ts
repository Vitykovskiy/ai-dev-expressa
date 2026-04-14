export type DomainErrorCode =
  | "administrator-role-required"
  | "role-not-assignable"
  | "user-not-found"
  | "user-blocked"
  | "invalid-working-hours"
  | "invalid-slot-capacity"
  | "invalid-drink-size-model"
  | "invalid-option-group-rule"
  | "invalid-auth-header"
  | "telegram-auth-disabled"
  | "telegram-auth-failed"
  | "unsupported-auth-channel";

export class DomainError extends Error {
  constructor(
    readonly code: DomainErrorCode,
    readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

