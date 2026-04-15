function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  const rawValue = import.meta.env.VITE_API_BASE_URL;

  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  return trimTrailingSlash(rawValue.trim());
}
