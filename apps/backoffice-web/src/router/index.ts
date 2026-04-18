import { createRouter, createWebHistory } from 'vue-router';
import type { NavigationGuardReturn } from 'vue-router';
import PlaceholderPage from '../pages/PlaceholderPage.vue';
import BackofficeAccessDeniedPage from '../pages/BackofficeAccessDeniedPage.vue';
import MenuCatalogShellPage from '../pages/MenuCatalogShellPage.vue';
import MenuCategoriesPage from '../pages/MenuCategoriesPage.vue';
import MenuProductsPage from '../pages/MenuProductsPage.vue';
import MenuProductDetailPage from '../pages/MenuProductDetailPage.vue';
import MenuAddonGroupDetailPage from '../pages/MenuAddonGroupDetailPage.vue';
import { appEnvironment } from '../services/app-environment';
import { backofficeAccessStore } from '../stores/backoffice-access-store';
import { menuCatalogStore } from '../stores/menu-catalog-store';
import type { BackofficeAccessState } from '../types';
import {
  backofficeNavigation,
  defaultBackofficeRoute,
} from './backoffice-navigation';
import {
  MENU_ADDON_GROUP_DETAIL_ROUTE_NAME,
  MENU_CATEGORIES_ROUTE_NAME,
  MENU_PRODUCTS_ROUTE_NAME,
  MENU_PRODUCT_DETAIL_ROUTE_NAME,
  MENU_ROOT_ROUTE_NAME,
  isBackofficeMenuRoute,
  resolveBackofficeRouteTabFromName,
  resolveMenuCatalogRouteGuard,
} from './menu-catalog-navigation';
import {
  isDirtyMenuLeaveBypassEnabled,
  shouldConfirmMenuCatalogLeave,
} from './menu-catalog-leave-confirmation';

export const BACKOFFICE_ACCESS_DENIED_ROUTE_NAME = 'access-denied';

interface BackofficeRouteLocation {
  fullPath: string;
  name: unknown;
}

export function resolveBackofficeRouteGuard(
  to: BackofficeRouteLocation,
  accessState: BackofficeAccessState,
): NavigationGuardReturn {
  const routeTab = resolveBackofficeRouteTabFromName(to.name);

  if (to.name === BACKOFFICE_ACCESS_DENIED_ROUTE_NAME || !routeTab) {
    return true;
  }

  if (!accessState.context) {
    return true;
  }

  if (accessState.context.availableTabs.includes(routeTab)) {
    return true;
  }

  return {
    name: BACKOFFICE_ACCESS_DENIED_ROUTE_NAME,
    query: {
      deniedPath: to.fullPath,
      deniedTab: routeTab,
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
    ...backofficeNavigation.filter((item) => item.tab !== 'menu').map((item) => ({
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
      path: '/menu',
      name: MENU_ROOT_ROUTE_NAME,
      component: MenuCatalogShellPage,
      redirect: {
        name: MENU_CATEGORIES_ROUTE_NAME,
      },
      meta: {
        title: 'Меню',
      },
      children: [
        {
          path: 'categories',
          name: MENU_CATEGORIES_ROUTE_NAME,
          component: MenuCategoriesPage,
          meta: {
            title: 'Меню · Категории',
          },
        },
        {
          path: 'categories/:categoryId/products',
          name: MENU_PRODUCTS_ROUTE_NAME,
          component: MenuProductsPage,
          meta: {
            title: 'Меню · Товары',
          },
        },
        {
          path: 'categories/:categoryId/products/:productId',
          name: MENU_PRODUCT_DETAIL_ROUTE_NAME,
          component: MenuProductDetailPage,
          meta: {
            title: 'Меню · Карточка товара',
          },
        },
        {
          path: 'categories/:categoryId/addon-groups/:optionGroupId',
          name: MENU_ADDON_GROUP_DETAIL_ROUTE_NAME,
          component: MenuAddonGroupDetailPage,
          meta: {
            title: 'Меню · Группа дополнительных опций',
          },
        },
      ],
    },
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

router.beforeEach(async (to, from) => {
  if (
    backofficeAccessStore.state.status === 'idle' ||
    backofficeAccessStore.state.status === 'restoring' ||
    backofficeAccessStore.state.status === 'bootstrapping'
  ) {
    await backofficeAccessStore.initialize();
  }

  if (
    !isDirtyMenuLeaveBypassEnabled() &&
    shouldConfirmMenuCatalogLeave({
      fromName: from.name,
      isDirty: menuCatalogStore.state.isDirty,
      toName: to.name,
    })
  ) {
    menuCatalogStore.requestPendingLeave(to.fullPath);
    return false;
  }

  const accessGuardResult = resolveBackofficeRouteGuard(to, backofficeAccessStore.state);

  if (accessGuardResult !== true) {
    return accessGuardResult;
  }

  if (
    isBackofficeMenuRoute(to.name) &&
    backofficeAccessStore.state.status === 'ready' &&
    backofficeAccessStore.state.accessToken
  ) {
    await menuCatalogStore.initialize(backofficeAccessStore.state.accessToken);

    const menuGuardResult = resolveMenuCatalogRouteGuard(to, menuCatalogStore.state);

    if (menuGuardResult !== true) {
      return menuGuardResult;
    }

    menuCatalogStore.syncNavigation(to.name, to.params);
  }

  return true;
});

router.afterEach((to) => {
  if (typeof document === 'undefined') {
    return;
  }

  const title = typeof to.meta.title === 'string' ? to.meta.title : defaultBackofficeRoute.label;
  document.title = `${title} | ${appEnvironment.appTitle}`;
});
