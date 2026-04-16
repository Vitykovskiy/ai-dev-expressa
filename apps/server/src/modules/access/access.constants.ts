import type { BackofficeTab, UserRole } from '@expressa/shared-types';

export const BACKOFFICE_ROLES: UserRole[] = ['barista', 'administrator'];
export const ADMINISTRATOR_ROLE: UserRole = 'administrator';

export const BACKOFFICE_TABS_BY_ROLE: Record<'barista' | 'administrator', BackofficeTab[]> = {
  administrator: ['orders', 'availability', 'menu', 'users', 'settings'],
  barista: ['orders', 'availability'],
};

