import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router';

import {
  authSessionStore,
  type AuthSessionBootstrapDependencies,
  type AuthSessionStore,
} from '@/features/auth-session/composables/authSessionStore';
import { createAdministratorGuard } from '@/features/auth-session/router/administratorGuard';
import AuthSessionEntryView from '@/features/auth-session/views/AuthSessionEntryView.vue';
import AppShellView from '@/features/app-shell/views/AppShellView.vue';

export interface CreateAppRouterOptions extends AuthSessionBootstrapDependencies {
  history?: RouterHistory;
  store?: AuthSessionStore;
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'auth-session-entry',
    component: AuthSessionEntryView,
  },
  {
    path: '/backoffice',
    name: 'backoffice-shell',
    component: AppShellView,
    meta: {
      requiresAdministrator: true,
    },
  },
];

export function createAppRouter(options: CreateAppRouterOptions = {}) {
  const store = options.store ?? authSessionStore;
  const router = createRouter({
    history: options.history ?? createWebHistory(),
    routes,
  });

  router.beforeEach(
    createAdministratorGuard(store, {
      api: options.api,
      telegramSource: options.telegramSource,
    }),
  );

  return router;
}

export const router = createAppRouter();
