export function getTelegramInitData(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.Telegram?.WebApp?.initData?.trim() || undefined;
}

export function prepareTelegramWebApp(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.Telegram?.WebApp?.ready?.();
  window.Telegram?.WebApp?.expand?.();
}
