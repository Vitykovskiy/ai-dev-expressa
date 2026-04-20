export interface RuntimeConfig {
  readonly port: number;
  readonly backofficeCorsOrigins: string[];
}

export interface RuntimeConfigEnvironment {
  readonly PORT?: string;
  readonly BACKOFFICE_CORS_ORIGINS?: string;
}

export class RuntimeConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuntimeConfigValidationError";
  }
}

export function loadRuntimeConfig(
  env: RuntimeConfigEnvironment,
): RuntimeConfig {
  return {
    port: readPort(env.PORT),
    backofficeCorsOrigins: readCorsOrigins(env.BACKOFFICE_CORS_ORIGINS),
  };
}

function readPort(value: string | undefined): number {
  if (value === undefined || value.trim() === "") {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RuntimeConfigValidationError(
      "PORT must be an integer between 1 and 65535.",
    );
  }

  return port;
}

function readCorsOrigins(value: string | undefined): string[] {
  const origins =
    value
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  if (origins.length === 0) {
    throw new RuntimeConfigValidationError(
      "BACKOFFICE_CORS_ORIGINS must contain at least one allowed origin.",
    );
  }

  return origins;
}
