import type { BackofficeAccessBootstrapRequest } from '@expressa/shared-types';

export interface TelegramWebAppBridge {
  expand?: () => void;
  initData?: string;
  ready?: () => void;
}

function resolveTelegramWebApp(
  telegram: unknown = (globalThis as { Telegram?: { WebApp?: TelegramWebAppBridge } }).Telegram,
): TelegramWebAppBridge | null {
  if (!telegram || typeof telegram !== 'object' || !('WebApp' in telegram)) {
    return null;
  }

  const bridge = telegram.WebApp;

  return bridge && typeof bridge === 'object' ? bridge : null;
}

export function initializeTelegramWebApp(bridge: TelegramWebAppBridge | null = resolveTelegramWebApp()) {
  bridge?.ready?.();
  bridge?.expand?.();
}

export function readBackofficeBootstrapRequest(
  bridge: TelegramWebAppBridge | null = resolveTelegramWebApp(),
): BackofficeAccessBootstrapRequest {
  const telegramInitData = bridge?.initData?.trim();

  return {
    mode: 'telegram',
    telegramInitData: telegramInitData && telegramInitData.length > 0 ? telegramInitData : undefined,
  };
}
