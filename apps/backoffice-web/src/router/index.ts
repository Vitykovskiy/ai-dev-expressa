import { createRouter, createWebHistory } from 'vue-router';
import type { NavigationGuardReturn } from 'vue-router';
import PlaceholderPage from '../pages/PlaceholderPage.vue';
import BackofficeAccessDeniedPage from '../pages/BackofficeAccessDeniedPage.vue';
import { appEnvironment } from '../services/app-environment';
import { backofficeAccessStore } from '../stores/backoffice-access-store';
import type { BackofficeAccessState } from '../types';
import {
  backofficeNavigation,
  defaultBackofficeRoute,
  isBackofficeTab,
} from './backoffice-navigation';

export const BACKOFFICE_ACCESS_DENIED_ROUTE_NAME = 'access-denied';

interface BackofficeRouteLocation {
  fullPath: string;
  name: unknown;
}

export function resolveBackofficeRouteGuard(
  to: BackofficeRouteLocation,
  accessState: BackofficeAccessState,
): NavigationGuardReturn {
  if (to.name === BACKOFFICE_ACCESS_DENIED_ROUTE_NAME || !isBackofficeTab(to.name)) {
    return true;
  }

  if (!accessState.context) {
    return true;
  }

  if (accessState.context.availableTabs.includes(to.name)) {
    return true;
  }

  return {
    name: BACKOFFICE_ACCESS_DENIED_ROUTE_NAME,
    query: {
      deniedPath: to.fullPath,
      deniedTab: to.name,
    },
    replace: true,
  };
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: defaultBackofficeRoute.path,
    },
    ...backofficeNavigation.map((item) => ({
      path: item.path,
      name: item.tab,
      component: PlaceholderPage,
      props: {
        title: item.label,
        summary: item.summary,
        accent: item.accent,
      },
      meta: {
        title: item.label,
      },
    })),
    {
      path: '/access-denied',
      name: BACKOFFICE_ACCESS_DENIED_ROUTE_NAME,
      component: BackofficeAccessDeniedPage,
      meta: {
        title: 'Отказ в доступе',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: defaultBackofficeRoute.path,
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  if (
    backofficeAccessStore.state.status === 'idle' ||
    backofficeAccessStore.state.status === 'restoring' ||
    backofficeAccessStore.state.status === 'bootstrapping'
  ) {
    await backofficeAccessStore.initialize();
  }

  return resolveBackofficeRouteGuard(to, backofficeAccessStore.state);
});

router.afterEach((to) => {
  if (typeof document === 'undefined') {
    return;
  }

  const title = typeof to.meta.title === 'string' ? to.meta.title : defaultBackofficeRoute.label;
  document.title = `${title} | ${appEnvironment.appTitle}`;
});
