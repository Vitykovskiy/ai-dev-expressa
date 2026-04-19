export function getTelegramInitData(): string | undefined {
  return window.Telegram?.WebApp?.initData?.trim() || undefined;
}

export function prepareTelegramWebApp(): void {
  window.Telegram?.WebApp?.ready?.();
  window.Telegram?.WebApp?.expand?.();
}
