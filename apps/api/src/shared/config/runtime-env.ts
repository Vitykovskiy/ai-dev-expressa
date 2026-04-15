import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';

export interface ApiRuntimeEnv {
  corsAllowedOrigin: string;
  port: number;
}

const API_PORT_ENV = 'API_PORT';
const API_CORS_ALLOWED_ORIGIN_ENV = 'API_CORS_ALLOWED_ORIGIN';
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

export function getApiRuntimeEnv(
  source: NodeJS.ProcessEnv = process.env,
): ApiRuntimeEnv {
  return {
    port: parsePort(readRequiredEnv(source, API_PORT_ENV)),
    corsAllowedOrigin: normalizeOrigin(
      readRequiredEnv(source, API_CORS_ALLOWED_ORIGIN_ENV),
    ),
  };
}
