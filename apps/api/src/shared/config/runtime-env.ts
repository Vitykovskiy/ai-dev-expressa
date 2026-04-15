import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';

export interface ApiRuntimeEnv {
  adminTelegramId: string;
  backofficeBotToken: string;
  corsAllowedOrigin: string;
  databaseUrl: string;
  disableTelegramAuth: boolean;
  port: number;
}

export const API_RUNTIME_ENV = Symbol('API_RUNTIME_ENV');

const API_PORT_ENV = 'API_PORT';
const API_CORS_ALLOWED_ORIGIN_ENV = 'API_CORS_ALLOWED_ORIGIN';
const ADMIN_TELEGRAM_ID_ENV = 'ADMIN_TELEGRAM_ID';
const DISABLE_TG_AUTH_ENV = 'DISABLE_TG_AUTH';
const DATABASE_URL_ENV = 'DATABASE_URL';
const TG_BACKOFFICE_BOT_TOKEN_ENV = 'TG_BACKOFFICE_BOT_TOKEN';
const API_PACKAGE_ROOT = resolve(__dirname, '..', '..', '..');

function loadEnvFileIfExists(path: string): void {
  if (existsSync(path)) {
    loadEnvFile(path);
  }
}

export function loadApiRuntimeEnvFiles(packageRoot = API_PACKAGE_ROOT): void {
  loadEnvFileIfExists(resolve(packageRoot, '.env.local'));
  loadEnvFileIfExists(resolve(packageRoot, '.env'));
}

function readRequiredEnv(
  source: NodeJS.ProcessEnv,
  key: string,
): string {
  const value = source[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(
      `${key} is not configured. Set it in process env or apps/api/.env.local`,
    );
  }

  return value.trim();
}

function parsePort(rawValue: string): number {
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${API_PORT_ENV} must be a positive integer`);
  }

  return parsedValue;
}

function normalizeOrigin(rawValue: string): string {
  try {
    const origin = new URL(rawValue);

    if (origin.pathname !== '/' || origin.search.length > 0 || origin.hash.length > 0) {
      throw new Error();
    }

    return origin.origin;
  } catch {
    throw new Error(
      `${API_CORS_ALLOWED_ORIGIN_ENV} must be an absolute origin without path`,
    );
  }
}

function normalizeTelegramId(rawValue: string): string {
  if (!/^\d+$/.test(rawValue)) {
    throw new Error(`${ADMIN_TELEGRAM_ID_ENV} must contain only digits`);
  }

  return rawValue;
}

function parseBooleanEnv(rawValue: string, key: string): boolean {
  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  throw new Error(`${key} must be either "true" or "false"`);
}

function normalizeDatabaseUrl(rawValue: string): string {
  if (!/^postgres(ql)?:\/\//.test(rawValue)) {
    throw new Error(`${DATABASE_URL_ENV} must be a PostgreSQL connection string`);
  }

  return rawValue;
}

export function getApiRuntimeEnv(
  source: NodeJS.ProcessEnv = process.env,
): ApiRuntimeEnv {
  return {
    adminTelegramId: normalizeTelegramId(readRequiredEnv(source, ADMIN_TELEGRAM_ID_ENV)),
    backofficeBotToken: readRequiredEnv(source, TG_BACKOFFICE_BOT_TOKEN_ENV),
    port: parsePort(readRequiredEnv(source, API_PORT_ENV)),
    corsAllowedOrigin: normalizeOrigin(
      readRequiredEnv(source, API_CORS_ALLOWED_ORIGIN_ENV),
    ),
    databaseUrl: normalizeDatabaseUrl(readRequiredEnv(source, DATABASE_URL_ENV)),
    disableTelegramAuth: parseBooleanEnv(
      readRequiredEnv(source, DISABLE_TG_AUTH_ENV),
      DISABLE_TG_AUTH_ENV,
    ),
  };
}
