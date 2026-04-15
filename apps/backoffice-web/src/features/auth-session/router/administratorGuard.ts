import type { NavigationGuardReturn, RouteLocationNormalizedGeneric } from 'vue-router';

import type {
  AuthSessionBootstrapDependencies,
  AuthSessionStore,
} from '@/features/auth-session/composables/authSessionStore';

function requiresAdministrator(route: RouteLocationNormalizedGeneric): boolean {
  return route.matched.some((record) => record.meta.requiresAdministrator === true);
}

export function createAdministratorGuard(
  store: AuthSessionStore,
  dependencies: AuthSessionBootstrapDependencies = {},
) {
  return async (
    to: RouteLocationNormalizedGeneric,
  ): Promise<NavigationGuardReturn> => {
    if (!requiresAdministrator(to)) {
      return true;
    }

    try {
      const result = await store.bootstrap(dependencies);

      return result.kind === 'authenticated'
        ? true
        : { name: 'auth-session-entry' };
    } catch {
      return { name: 'auth-session-entry' };
    }
  };
}
