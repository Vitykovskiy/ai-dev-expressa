export type RuntimeEnvironment = "production" | "test" | "development";

export interface AccessConfig {
  readonly environment: RuntimeEnvironment;
  readonly adminTelegramId: string;
  readonly disableTelegramAuth: boolean;
  readonly serviceTelegramBotToken?: string;
}

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigValidationError";
  }
}

export function loadAccessConfig(env: NodeJS.ProcessEnv = process.env): AccessConfig {
  const environment = normalizeEnvironment(env.NODE_ENV);
  const adminTelegramId = readRequiredTelegramId(env.ADMIN_TELEGRAM_ID, "ADMIN_TELEGRAM_ID");
  const disableTelegramAuth = readBoolean(env.DISABLE_TG_AUTH, "DISABLE_TG_AUTH");
  const serviceTelegramBotToken = env.SERVICE_TELEGRAM_BOT_TOKEN?.trim();

  if (disableTelegramAuth && environment !== "test") {
    throw new ConfigValidationError("DISABLE_TG_AUTH=true is allowed only when NODE_ENV=test.");
  }

  if (!disableTelegramAuth && !serviceTelegramBotToken) {
    throw new ConfigValidationError(
      "SERVICE_TELEGRAM_BOT_TOKEN is required when Telegram auth is enabled."
    );
  }

  return {
    environment,
    adminTelegramId,
    disableTelegramAuth,
    serviceTelegramBotToken
  };
}

function normalizeEnvironment(value: string | undefined): RuntimeEnvironment {
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }

  return "development";
}

function readRequiredTelegramId(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new ConfigValidationError(`${name} is required.`);
  }

  if (!/^\d+$/.test(trimmed)) {
    throw new ConfigValidationError(`${name} must be a numeric Telegram identifier.`);
  }

  return trimmed;
}

function readBoolean(value: string | undefined, name: string): boolean {
  if (value === undefined || value === "") {
    return false;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new ConfigValidationError(`${name} must be either true or false.`);
}
