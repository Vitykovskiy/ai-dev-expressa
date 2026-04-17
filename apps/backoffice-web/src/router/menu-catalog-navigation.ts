import type { BackofficeTab, MenuCatalogSnapshot } from '@expressa/shared-types';
import type { NavigationGuardReturn } from 'vue-router';
import type { MenuCatalogState } from '../types';

export const MENU_ROOT_ROUTE_NAME = 'menu';
export const MENU_CATEGORIES_ROUTE_NAME = 'menu.menu_categories';
export const MENU_PRODUCTS_ROUTE_NAME = 'menu.menu_products';
export const MENU_PRODUCT_DETAIL_ROUTE_NAME = 'menu.menu_product_detail';
export const MENU_ADDON_GROUP_DETAIL_ROUTE_NAME = 'menu.addon_group_detail';
export const NEW_MENU_PRODUCT_ID = 'new';

export type MenuCatalogRouteName =
  | typeof MENU_ROOT_ROUTE_NAME
  | typeof MENU_CATEGORIES_ROUTE_NAME
  | typeof MENU_PRODUCTS_ROUTE_NAME
  | typeof MENU_PRODUCT_DETAIL_ROUTE_NAME
  | typeof MENU_ADDON_GROUP_DETAIL_ROUTE_NAME;

interface MenuCatalogRouteLocation {
  fullPath: string;
  name: unknown;
  params: Record<string, unknown>;
}

function readRouteParam(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function findCategory(catalog: MenuCatalogSnapshot, categoryId: string) {
  return catalog.categories.find((category) => category.menuCategoryId === categoryId) ?? null;
}

function findProduct(catalog: MenuCatalogSnapshot, productId: string) {
  return catalog.items.find((item) => item.menuItemId === productId) ?? null;
}

function findOptionGroup(catalog: MenuCatalogSnapshot, optionGroupId: string) {
  return (
    catalog.optionGroups.find((optionGroup) => optionGroup.optionGroupId === optionGroupId) ?? null
  );
}

export function isMenuCatalogRouteName(value: unknown): value is MenuCatalogRouteName {
  return (
    value === MENU_ROOT_ROUTE_NAME ||
    value === MENU_CATEGORIES_ROUTE_NAME ||
    value === MENU_PRODUCTS_ROUTE_NAME ||
    value === MENU_PRODUCT_DETAIL_ROUTE_NAME ||
    value === MENU_ADDON_GROUP_DETAIL_ROUTE_NAME
  );
}

export function isBackofficeMenuRoute(value: unknown): value is MenuCatalogRouteName {
  return isMenuCatalogRouteName(value);
}

export function resolveBackofficeRouteTabFromName(routeName: unknown): BackofficeTab | null {
  if (routeName === 'orders' || routeName === 'availability' || routeName === 'users' || routeName === 'settings') {
    return routeName;
  }

  if (isBackofficeMenuRoute(routeName)) {
    return 'menu';
  }

  return null;
}

export function createMenuCategoriesRoute(): { name: typeof MENU_CATEGORIES_ROUTE_NAME } {
  return { name: MENU_CATEGORIES_ROUTE_NAME };
}

export function createMenuProductsRoute(
  categoryId: string,
): { name: typeof MENU_PRODUCTS_ROUTE_NAME; params: { categoryId: string } } {
  return {
    name: MENU_PRODUCTS_ROUTE_NAME,
    params: { categoryId },
  };
}

export function createMenuProductDetailRoute(
  categoryId: string,
  productId: string,
): {
  name: typeof MENU_PRODUCT_DETAIL_ROUTE_NAME;
  params: { categoryId: string; productId: string };
} {
  return {
    name: MENU_PRODUCT_DETAIL_ROUTE_NAME,
    params: { categoryId, productId },
  };
}

export function createMenuNewProductRoute(
  categoryId: string,
): {
  name: typeof MENU_PRODUCT_DETAIL_ROUTE_NAME;
  params: { categoryId: string; productId: typeof NEW_MENU_PRODUCT_ID };
} {
  return {
    name: MENU_PRODUCT_DETAIL_ROUTE_NAME,
    params: { categoryId, productId: NEW_MENU_PRODUCT_ID },
  };
}

export function createMenuAddonGroupDetailRoute(
  categoryId: string,
  optionGroupId: string,
): {
  name: typeof MENU_ADDON_GROUP_DETAIL_ROUTE_NAME;
  params: { categoryId: string; optionGroupId: string };
} {
  return {
    name: MENU_ADDON_GROUP_DETAIL_ROUTE_NAME,
    params: { categoryId, optionGroupId },
  };
}

export function resolveMenuCatalogRouteGuard(
  to: MenuCatalogRouteLocation,
  menuCatalogState: MenuCatalogState,
): NavigationGuardReturn {
  if (!isMenuCatalogRouteName(to.name)) {
    return true;
  }

  if (to.name === MENU_ROOT_ROUTE_NAME) {
    return {
      ...createMenuCategoriesRoute(),
      replace: true,
    };
  }

  const catalog = menuCatalogState.catalog;

  if (!catalog) {
    return true;
  }

  if (to.name === MENU_CATEGORIES_ROUTE_NAME) {
    return true;
  }

  const categoryId = readRouteParam(to.params.categoryId);

  if (!categoryId || !findCategory(catalog, categoryId)) {
    return {
      ...createMenuCategoriesRoute(),
      replace: true,
    };
  }

  if (to.name === MENU_PRODUCTS_ROUTE_NAME) {
    return true;
  }

  if (to.name === MENU_PRODUCT_DETAIL_ROUTE_NAME) {
    const productId = readRouteParam(to.params.productId);

    if (productId === NEW_MENU_PRODUCT_ID) {
      return true;
    }

    const product = productId ? findProduct(catalog, productId) : null;

    if (!product || product.menuCategoryId !== categoryId) {
      return {
        ...createMenuProductsRoute(categoryId),
        replace: true,
      };
    }

    return true;
  }

  const optionGroupId = readRouteParam(to.params.optionGroupId);
  const category = findCategory(catalog, categoryId);
  const optionGroup = optionGroupId ? findOptionGroup(catalog, optionGroupId) : null;

  if (!category || !optionGroup || !category.optionGroupRefs.includes(optionGroup.optionGroupId)) {
    return {
      ...createMenuProductsRoute(categoryId),
      replace: true,
    };
  }

  return true;
}
