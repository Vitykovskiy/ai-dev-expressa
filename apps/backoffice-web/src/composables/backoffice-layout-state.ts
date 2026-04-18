import type { BackofficeTab } from '@expressa/shared-types';
import { computed, type ComputedRef, type Ref } from 'vue';
import {
  backofficeNavigation,
  resolveAllowedBackofficeRoute,
  resolveBackofficeNavigation,
  resolveBackofficeNavigationItem,
  resolveBackofficeRouteTab,
} from '../router/backoffice-navigation';
import type {
  BackofficeAccessError,
  BackofficeAccessState,
  BackofficeNavigationItem,
} from '../types';

export interface BackofficeLayoutBlockingState {
  kind: 'loading' | 'error' | 'access-denied';
  reason: string | null;
  title: string;
  text: string;
}

export interface BackofficeLayoutViewModel {
  blockingState: BackofficeLayoutBlockingState | null;
  brandSummary: string;
  currentItem: BackofficeNavigationItem;
  currentPath: string | null;
  currentTab: BackofficeTab | null;
  heroChip: string;
  heroEyebrow: string;
  heroText: string;
  heroTitle: string;
  navigationItems: BackofficeNavigationItem[];
  roleLabel: string;
  sessionLabel: string;
  sessionSummary: string;
}

export function buildBackofficeLayoutViewModel(
  accessState: BackofficeAccessState,
  routeName: unknown,
): BackofficeLayoutViewModel {
  const navigationItems = accessState.context
    ? resolveBackofficeNavigation(accessState.context.availableTabs)
    : backofficeNavigation;
  const currentTab = resolveBackofficeRouteTab(routeName);
  const currentItem = currentTab
    ? resolveBackofficeNavigationItem(currentTab)
    : resolveAllowedBackofficeRoute(accessState.context?.availableTabs ?? []);
  const blockingState = resolveBlockingState(accessState);

  return {
    blockingState,
    brandSummary: resolveBrandSummary(accessState),
    currentItem,
    currentPath: currentTab ? currentItem.path : null,
    currentTab,
    heroChip: resolveHeroChip(accessState),
    heroEyebrow: resolveHeroEyebrow(accessState, routeName),
    heroText: resolveHeroText(accessState, blockingState),
    heroTitle: resolveHeroTitle(accessState, routeName, currentItem.label),
    navigationItems,
    roleLabel: resolveRoleLabel(accessState),
    sessionLabel: resolveSessionLabel(accessState),
    sessionSummary: resolveSessionSummary(accessState),
  };
}

export function useBackofficeLayoutState(
  accessState: BackofficeAccessState,
  routeName: Ref<unknown>,
): ComputedRef<BackofficeLayoutViewModel> {
  return computed(() => buildBackofficeLayoutViewModel(accessState, routeName.value));
}

function isLoadingState(accessState: BackofficeAccessState): boolean {
  return (
    accessState.status === 'idle' ||
    accessState.status === 'restoring' ||
    accessState.status === 'bootstrapping'
  );
}

function isAccessDeniedError(error: BackofficeAccessError | null): boolean {
  return error !== null && error.reason !== 'network-error' && error.reason !== 'unexpected-response';
}

function resolveBlockingState(
  accessState: BackofficeAccessState,
): BackofficeLayoutBlockingState | null {
  if (isLoadingState(accessState)) {
    return {
      kind: 'loading',
      reason: null,
      title: 'Инициализация контекста доступа',
      text: 'Клиентская часть синхронизирует текущую сессию с apps/server и готовит ролевые guard-правила.',
    };
  }

  if (isAccessDeniedError(accessState.error)) {
    const accessError = accessState.error as BackofficeAccessError;

    return {
      kind: 'access-denied',
      reason: accessError.reason,
      title: resolveAccessDeniedTitle(accessError),
      text: resolveAccessDeniedText(accessError),
    };
  }

  if (accessState.error) {
    return {
      kind: 'error',
      reason: accessState.error.reason,
      title: 'Не удалось получить контекст доступа',
      text: accessState.error.message,
    };
  }

  return null;
}

function resolveBrandSummary(accessState: BackofficeAccessState): string {
  if (accessState.context) {
    return `Контекст ${accessState.context.user.telegramId} синхронизирован с apps/server, навигация и route guards строятся по availableTabs.`;
  }

  if (isAccessDeniedError(accessState.error)) {
    return 'Рабочая навигация не открыта: клиентская часть остановила вход до загрузки вкладок и предметных данных.';
  }

  if (accessState.error) {
    return 'Bootstrap доступа завершился ошибкой. Контекст можно запросить повторно без перезагрузки страницы.';
  }

  return 'Клиентская часть восстанавливает текущую сессию и готовит серверно-управляемую навигацию вкладок.';
}

function resolveHeroEyebrow(accessState: BackofficeAccessState, routeName: unknown): string {
  if (routeName === 'access-denied') {
    return 'Route guard внутреннего административного контура';
  }

  if (accessState.context) {
    return 'Контекст доступа получен из apps/server';
  }

  return 'Vue 3 · Vite · Vuetify · Vue Router · Vitest';
}

function resolveHeroTitle(
  accessState: BackofficeAccessState,
  routeName: unknown,
  currentItemLabel: string,
): string {
  if (routeName === 'access-denied') {
    return 'Прямой переход по URL остановлен';
  }

  if (isAccessDeniedError(accessState.error)) {
    return resolveAccessDeniedTitle(accessState.error as BackofficeAccessError);
  }

  if (accessState.error) {
    return 'Bootstrap доступа требует повторной попытки';
  }

  if (!accessState.context) {
    return 'Контекст доступа инициализируется';
  }

  return currentItemLabel;
}

function resolveHeroText(
  accessState: BackofficeAccessState,
  blockingState: BackofficeLayoutBlockingState | null,
): string {
  if (blockingState?.kind === 'access-denied') {
    return `${blockingState.text} Основание отказа пришло из текущего клиентского или серверного guard-слоя.`;
  }

  if (blockingState?.kind === 'error') {
    return 'HTTP-клиент получил ответ об ошибке или не смог связаться с apps/server. Контекст доступа можно запросить повторно.';
  }

  if (!accessState.context) {
    return 'Клиентская часть восстанавливает accessToken, читает текущий контекст через GET /api/backoffice/access/me и при необходимости выполняет POST /api/backoffice/access/bootstrap.';
  }

  return `Доступные вкладки приходят из apps/server без локального вычисления ролей. Активная сессия: ${accessState.context.user.roles.join(', ')}.`;
}

function resolveHeroChip(accessState: BackofficeAccessState): string {
  if (accessState.context?.isTestMode) {
    return 'FEATURE-001 / test-mode session';
  }

  if (accessState.context) {
    return 'FEATURE-001 / Telegram guard session';
  }

  if (isAccessDeniedError(accessState.error)) {
    return 'FEATURE-001 / access denied';
  }

  return 'FEATURE-001 / FE-003';
}

function resolveRoleLabel(accessState: BackofficeAccessState): string {
  if (accessState.context?.user.roles.includes('administrator')) {
    return 'Администратор';
  }

  if (accessState.context?.user.roles.includes('barista')) {
    return 'Бариста';
  }

  if (isAccessDeniedError(accessState.error)) {
    return 'Доступ не открыт';
  }

  if (accessState.error) {
    return 'Нужна повторная попытка';
  }

  return 'Синхронизация роли';
}

function resolveSessionLabel(accessState: BackofficeAccessState): string {
  if (accessState.context?.isTestMode) {
    return 'Test environment';
  }

  if (accessState.context) {
    return 'Telegram-вход';
  }

  if (isAccessDeniedError(accessState.error)) {
    return 'Отказ в доступе';
  }

  if (accessState.error) {
    return 'Ошибка bootstrap';
  }

  return 'Инициализация';
}

function resolveSessionSummary(accessState: BackofficeAccessState): string {
  if (accessState.context) {
    return `@${accessState.context.user.telegramId} · вкладок: ${accessState.context.availableTabs.length}`;
  }

  if (isAccessDeniedError(accessState.error)) {
    return (accessState.error as BackofficeAccessError).message;
  }

  if (accessState.error) {
    return accessState.error.message;
  }

  return 'Ожидается серверный контекст текущего пользователя.';
}

function resolveAccessDeniedTitle(error: BackofficeAccessError): string {
  switch (error.reason) {
    case 'telegram-context-required':
      return 'Нужен Telegram-контекст';
    case 'telegram-context-invalid':
      return 'Telegram-контекст не прошёл проверку';
    case 'test-mode-disabled':
      return 'Test environment выключен';
    case 'test-telegram-id-required':
      return 'Не задан test Telegram ID';
    case 'user-not-found':
      return 'Пользователь не зарегистрирован';
    case 'backoffice-role-required':
      return 'Недостаточно прав для backoffice';
    case 'user-blocked':
      return 'Пользователь заблокирован';
    default:
      return 'Доступ во внутренний административный контур запрещён';
  }
}

function resolveAccessDeniedText(error: BackofficeAccessError): string {
  switch (error.reason) {
    case 'telegram-context-required':
      return 'Прямой рабочий вход по URL без Telegram не поддерживается. Исключение допускается только в test environment.';
    case 'telegram-context-invalid':
      return 'Клиент получил Telegram-контекст, но сервер отклонил его подпись или связку со служебным ботом.';
    case 'test-mode-disabled':
      return 'Локальный test environment не включён на серверной стороне, поэтому bootstrap без Telegram отклонён.';
    case 'test-telegram-id-required':
      return 'Клиентская часть не может собрать test-mode payload без VITE_TEST_TELEGRAM_ID.';
    case 'user-not-found':
      return 'Сервер не нашёл пользователя для указанного Telegram ID и не создал рабочую сессию.';
    case 'backoffice-role-required':
      return 'Пользователь найден, но не имеет роли barista или administrator для входа во внутренний административный контур.';
    case 'user-blocked':
      return 'Сервер вернул blocked-состояние, поэтому доступ в backoffice остановлен до загрузки вкладок.';
    default:
      return error.message;
  }
}
