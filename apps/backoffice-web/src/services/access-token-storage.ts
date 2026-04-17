const DEFAULT_ACCESS_TOKEN_STORAGE_KEY = 'expressa.backoffice.access-token';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export interface BackofficeAccessTokenStorage {
  clear(): void;
  read(): string | null;
  write(accessToken: string): void;
}

export function createBackofficeAccessTokenStorage(
  storage: Storage | null = getStorage(),
  storageKey: string = DEFAULT_ACCESS_TOKEN_STORAGE_KEY,
): BackofficeAccessTokenStorage {
  return {
    clear() {
      storage?.removeItem(storageKey);
    },
    read() {
      const accessToken = storage?.getItem(storageKey)?.trim();
      return accessToken && accessToken.length > 0 ? accessToken : null;
    },
    write(accessToken: string) {
      storage?.setItem(storageKey, accessToken);
    },
  };
}
