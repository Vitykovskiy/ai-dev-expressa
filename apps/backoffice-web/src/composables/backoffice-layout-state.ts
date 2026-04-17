import type { BackofficeTab } from '@expressa/shared-types';
import { computed, type ComputedRef, type Ref } from 'vue';
import {
  backofficeNavigation,
  resolveBackofficeNavigation,
  resolveBackofficeNavigationItem,
  resolveBackofficeRouteTab,
} from '../router/backoffice-navigation';
import type {
  BackofficeAccessState,
  BackofficeNavigationItem,
} from '../types';

export interface BackofficeLayoutViewModel {
  brandSummary: string;
  currentItem: BackofficeNavigationItem;
  currentTab: BackofficeTab;
  heroChip: string;
  heroEyebrow: string;
  heroText: string;
  heroTitle: string;
  isLoading: boolean;
  navigationItems: BackofficeNavigationItem[];
  sessionLabel: string;
  sessionSummary: string;
}

export function buildBackofficeLayoutViewModel(
  accessState: BackofficeAccessState,
  routeName: unknown,
): BackofficeLayoutViewModel {
  const isLoading =
    accessState.status === 'idle' ||
    accessState.status === 'restoring' ||
    accessState.status === 'bootstrapping';
  const navigationItems = accessState.context
    ? resolveBackofficeNavigation(accessState.context.availableTabs)
    : backofficeNavigation;
  const currentTab = resolveBackofficeRouteTab(routeName);
  const currentItem = resolveBackofficeNavigationItem(currentTab);

  return {
    brandSummary: resolveBrandSummary(accessState),
    currentItem,
    currentTab,
    heroChip: resolveHeroChip(accessState),
    heroEyebrow: resolveHeroEyebrow(accessState),
    heroText: resolveHeroText(accessState),
    heroTitle: resolveHeroTitle(accessState, currentItem.label),
    isLoading,
    navigationItems,
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

function resolveBrandSummary(accessState: BackofficeAccessState): string {
  if (accessState.context) {
    return `Контекст ${accessState.context.user.telegramId} синхронизирован с server, навигация строится по availableTabs.`;
  }

  if (accessState.error) {
    return 'Bootstrap доступа завершился ошибкой. Контекст можно запросить повторно без перезагрузки страницы.';
  }

  return 'Клиентская часть восстанавливает текущую сессию и готовит серверно-управляемую навигацию вкладок.';
}

function resolveHeroEyebrow(accessState: BackofficeAccessState): string {
  if (accessState.context) {
    return 'Контекст доступа получен из apps/server';
  }

  return 'Vue 3 · Vite · Vuetify · Vue Router · Vitest';
}

function resolveHeroTitle(
  accessState: BackofficeAccessState,
  currentItemLabel: string,
): string {
  if (accessState.error) {
    return 'Bootstrap доступа требует повторной попытки';
  }

  if (!accessState.context) {
    return 'Контекст доступа инициализируется';
  }

  return currentItemLabel;
}

function resolveHeroText(accessState: BackofficeAccessState): string {
  if (accessState.error) {
    return 'HTTP-клиент получил ответ об ошибке или не смог связаться с server. Финальные guard-правила и экран отказа остаются задачей FE-003.';
  }

  if (!accessState.context) {
    return 'Клиентская часть восстанавливает accessToken, читает текущий контекст через GET /api/backoffice/access/me и при необходимости выполняет POST /api/backoffice/access/bootstrap.';
  }

  return `Доступные вкладки приходят из server без локального вычисления ролей. Активная сессия: ${accessState.context.user.roles.join(', ')}.`;
}

function resolveHeroChip(accessState: BackofficeAccessState): string {
  if (accessState.context?.isTestMode) {
    return 'FEATURE-001 / test-mode session';
  }

  if (accessState.context) {
    return 'FEATURE-001 / Telegram session';
  }

  return 'FEATURE-001 / FE-002';
}

function resolveSessionLabel(accessState: BackofficeAccessState): string {
  if (accessState.context?.isTestMode) {
    return 'Test environment';
  }

  if (accessState.context) {
    return 'Telegram-вход';
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

  if (accessState.error) {
    return accessState.error.message;
  }

  return 'Ожидается серверный контекст текущего пользователя.';
}
