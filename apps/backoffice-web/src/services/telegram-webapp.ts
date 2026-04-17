import type { BackofficeAccessBootstrapRequest } from '@expressa/shared-types';
import type { BackofficeAppEnvironment, BackofficeAccessError } from '../types';

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

export function readTelegramInitData(
  bridge: TelegramWebAppBridge | null = resolveTelegramWebApp(),
) {
  const telegramInitData = bridge?.initData?.trim();

  return telegramInitData && telegramInitData.length > 0 ? telegramInitData : null;
}

function createBootstrapPreparationError(
  reason: BackofficeAccessError['reason'],
  message: string,
  statusCode: number,
): BackofficeAccessError {
  return {
    statusCode,
    reason,
    message,
  };
}

export function readBackofficeBootstrapRequest(
  environment: Pick<BackofficeAppEnvironment, 'disableTelegramAuth' | 'testTelegramId'>,
  bridge: TelegramWebAppBridge | null = resolveTelegramWebApp(),
): BackofficeAccessBootstrapRequest {
  const telegramInitData = readTelegramInitData(bridge);

  if (telegramInitData) {
    return {
      mode: 'telegram',
      telegramInitData,
    };
  }

  if (!environment.disableTelegramAuth) {
    throw createBootstrapPreparationError(
      'telegram-context-required',
      'Telegram-контекст служебного бота обязателен для рабочего входа во внутренний административный контур.',
      401,
    );
  }

  if (!environment.testTelegramId) {
    throw createBootstrapPreparationError(
      'test-telegram-id-required',
      'Для локального входа в test environment укажите VITE_TEST_TELEGRAM_ID.',
      400,
    );
  }

  return {
    mode: 'test',
    testTelegramId: environment.testTelegramId,
  };
}
