import type { BackofficeTab, UserRole } from '@expressa/shared-types';

export const ADMINISTRATOR_ROLE: UserRole = 'administrator';
export const BACKOFFICE_ROLES: ReadonlyArray<UserRole> = ['barista', 'administrator'];

const BACKOFFICE_TABS_BY_ROLE: Record<'barista' | 'administrator', BackofficeTab[]> = {
  administrator: ['orders', 'availability', 'menu', 'users', 'settings'],
  barista: ['orders', 'availability'],
};

export function resolveAvailableTabs(roles: readonly UserRole[]): BackofficeTab[] {
  if (roles.includes(ADMINISTRATOR_ROLE)) {
    return [...BACKOFFICE_TABS_BY_ROLE.administrator];
  }

  return [...BACKOFFICE_TABS_BY_ROLE.barista];
}
