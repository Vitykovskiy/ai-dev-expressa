import type { BackofficeAppEnvironment } from '../types';

const DEFAULT_APP_TITLE = 'Expressa Backoffice';
const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function readNonEmptyString(value: string | undefined, fallback: string): string {
  const normalizedValue = value?.trim();
  return normalizedValue && normalizedValue.length > 0 ? normalizedValue : fallback;
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

export function readAppEnvironment(): BackofficeAppEnvironment {
  return {
    appTitle: readNonEmptyString(import.meta.env.VITE_APP_TITLE, DEFAULT_APP_TITLE),
    apiBaseUrl: trimTrailingSlashes(
      readNonEmptyString(import.meta.env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL),
    ),
  };
}

export const appEnvironment = readAppEnvironment();
