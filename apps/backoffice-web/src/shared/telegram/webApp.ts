export interface TelegramWebAppSource {
  getInitData(): string | null;
  prepare(): void;
}

function normalizeInitData(value: string | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function readTelegramWebAppInitData(
  target: Window | undefined = typeof window === 'undefined' ? undefined : window,
): string | null {
  return normalizeInitData(target?.Telegram?.WebApp?.initData);
}

export const telegramWebAppSource: TelegramWebAppSource = {
  getInitData() {
    return readTelegramWebAppInitData();
  },
  prepare() {
    if (typeof window === 'undefined') {
      return;
    }

    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
  },
};
