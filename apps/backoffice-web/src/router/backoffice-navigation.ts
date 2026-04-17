import type { BackofficeNavigationItem } from '../types';

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
