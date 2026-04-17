import type { BackofficeTab } from '@expressa/shared-types';
import type { BackofficeNavigationItem } from '../types';
import { resolveBackofficeRouteTabFromName } from './menu-catalog-navigation';

export const backofficeNavigation: BackofficeNavigationItem[] = [
  {
    tab: 'orders',
    path: '/orders',
    label: 'Заказы',
    summary: 'Операционная очередь заказов и точка входа для баристы.',
    accent: 'var(--expressa-accent-orders)',
  },
  {
    tab: 'availability',
    path: '/availability',
    label: 'Доступность',
    summary: 'Временное управление доступностью меню, опций и допов.',
    accent: 'var(--expressa-accent-availability)',
  },
  {
    tab: 'menu',
    path: '/menu',
    label: 'Меню',
    summary: 'Административный контур управления каталогом и структурой товаров.',
    accent: 'var(--expressa-accent-menu)',
  },
  {
    tab: 'users',
    path: '/users',
    label: 'Пользователи',
    summary: 'Контур назначения ролей и блокировки доступа.',
    accent: 'var(--expressa-accent-users)',
  },
  {
    tab: 'settings',
    path: '/settings',
    label: 'Настройки',
    summary: 'Рабочие часы, вместимость слотов и служебные параметры backoffice.',
    accent: 'var(--expressa-accent-settings)',
  },
];

export const defaultBackofficeRoute = backofficeNavigation[0];

const navigationByTab = new Map<BackofficeTab, BackofficeNavigationItem>(
  backofficeNavigation.map((item) => [item.tab, item]),
);

export function resolveBackofficeNavigation(availableTabs: readonly BackofficeTab[]) {
  return availableTabs
    .map((tab) => navigationByTab.get(tab))
    .filter((item): item is BackofficeNavigationItem => item !== undefined);
}

export function isBackofficeTab(value: unknown): value is BackofficeTab {
  return typeof value === 'string' && navigationByTab.has(value as BackofficeTab);
}

export function resolveAllowedBackofficeRoute(
  availableTabs: readonly BackofficeTab[],
): BackofficeNavigationItem {
  return resolveBackofficeNavigation(availableTabs)[0] ?? defaultBackofficeRoute;
}

export function resolveBackofficeNavigationItem(tab: unknown): BackofficeNavigationItem {
  return isBackofficeTab(tab) ? navigationByTab.get(tab) ?? defaultBackofficeRoute : defaultBackofficeRoute;
}

export function resolveBackofficeRouteTab(routeName: unknown): BackofficeTab | null {
  return resolveBackofficeRouteTabFromName(routeName);
}
