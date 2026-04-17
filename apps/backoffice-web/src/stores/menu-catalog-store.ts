import type {
  MenuCatalogSnapshot,
  MenuCatalogCategory,
  MenuCatalogItem,
  MenuCatalogOptionGroup,
} from '@expressa/shared-types';
import { reactive } from 'vue';
import { appEnvironment } from '../services/app-environment';
import {
  BackofficeMenuCatalogApi,
  normalizeBackofficeMenuCatalogError,
} from '../services/backoffice-menu-catalog-api';
import type { MenuCatalogProductDraft, MenuCatalogSelectionState, MenuCatalogState } from '../types';
import type { MenuCatalogRouteName } from '../router/menu-catalog-navigation';

interface MenuCatalogApiPort {
  getCatalog(accessToken: string): Promise<MenuCatalogSnapshot>;
  saveCatalog(accessToken: string, request: MenuCatalogSnapshot): Promise<MenuCatalogSnapshot>;
}

interface MenuCatalogStoreDependencies {
  menuCatalogApi: MenuCatalogApiPort;
  createId?: (prefix: string) => string;
}

export interface MenuCatalogStore {
  addCategory(name: string): MenuCatalogCategory | null;
  addProduct(categoryId: string, productDraft: MenuCatalogProductDraft): MenuCatalogItem | null;
  clear(): void;
  initialize(accessToken: string): Promise<void>;
  reload(accessToken: string): Promise<void>;
  replaceCatalog(catalog: MenuCatalogSnapshot): void;
  save(accessToken: string): Promise<MenuCatalogSnapshot | null>;
  syncNavigation(routeName: MenuCatalogRouteName, params: Record<string, unknown>): void;
  state: MenuCatalogState;
  updateCategoryName(categoryId: string, name: string): boolean;
  updateDraft(mutator: (catalog: MenuCatalogSnapshot) => void): boolean;
  updateProduct(productId: string, productDraft: MenuCatalogProductDraft): boolean;
}

function createEmptySelection(): MenuCatalogSelectionState {
  return {
    categoryId: null,
    productId: null,
    optionGroupId: null,
  };
}

function readRouteParam(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function findCategory(catalog: MenuCatalogSnapshot, categoryId: string): MenuCatalogCategory | null {
  return catalog.categories.find((category) => category.menuCategoryId === categoryId) ?? null;
}

function createDefaultId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function findMenuCatalogCategory(
  catalog: MenuCatalogSnapshot | null,
  categoryId: string | null,
): MenuCatalogCategory | null {
  if (!catalog || !categoryId) {
    return null;
  }

  return findCategory(catalog, categoryId);
}

export function findMenuCatalogProduct(
  catalog: MenuCatalogSnapshot | null,
  productId: string | null,
): MenuCatalogItem | null {
  if (!catalog || !productId) {
    return null;
  }

  return catalog.items.find((item) => item.menuItemId === productId) ?? null;
}

export function findMenuCatalogOptionGroup(
  catalog: MenuCatalogSnapshot | null,
  optionGroupId: string | null,
): MenuCatalogOptionGroup | null {
  if (!catalog || !optionGroupId) {
    return null;
  }

  return catalog.optionGroups.find((optionGroup) => optionGroup.optionGroupId === optionGroupId) ?? null;
}

export function resolveMenuCategoryProducts(
  catalog: MenuCatalogSnapshot | null,
  categoryId: string | null,
): MenuCatalogItem[] {
  if (!catalog || !categoryId) {
    return [];
  }

  return catalog.items.filter((item) => item.menuCategoryId === categoryId);
}

export function resolveMenuCategoryOptionGroups(
  catalog: MenuCatalogSnapshot | null,
  categoryId: string | null,
): MenuCatalogOptionGroup[] {
  const category = findMenuCatalogCategory(catalog, categoryId);

  if (!catalog || !category) {
    return [];
  }

  return category.optionGroupRefs
    .map((optionGroupId) => findMenuCatalogOptionGroup(catalog, optionGroupId))
    .filter((optionGroup): optionGroup is MenuCatalogOptionGroup => optionGroup !== null);
}

export function resolveMenuProductPriceSummary(product: MenuCatalogItem): string {
  if (product.itemType === 'drink') {
    return product.sizePrices.map((sizePrice) => `${sizePrice.size} ${sizePrice.price} ₽`).join(' · ');
  }

  return product.basePrice === null ? 'Цена не задана' : `${product.basePrice} ₽`;
}

function normalizeSelection(
  catalog: MenuCatalogSnapshot | null,
  nextSelection: MenuCatalogSelectionState,
): MenuCatalogSelectionState {
  const category = findMenuCatalogCategory(catalog, nextSelection.categoryId);
  const categoryId = category?.menuCategoryId ?? null;
  const product = findMenuCatalogProduct(catalog, nextSelection.productId);
  const productId = product && product.menuCategoryId === categoryId ? product.menuItemId : null;
  const optionGroup = findMenuCatalogOptionGroup(catalog, nextSelection.optionGroupId);
  const optionGroupId =
    optionGroup && category && category.optionGroupRefs.includes(optionGroup.optionGroupId)
      ? optionGroup.optionGroupId
      : null;

  return {
    categoryId,
    productId,
    optionGroupId,
  };
}

export function createMenuCatalogStore({
  menuCatalogApi,
  createId = createDefaultId,
}: MenuCatalogStoreDependencies): MenuCatalogStore {
  const state = reactive<MenuCatalogState>({
    status: 'idle',
    catalog: null,
    error: null,
    isDirty: false,
    selection: createEmptySelection(),
  });
  let pendingInitialization: Promise<void> | null = null;

  function commitCatalog(catalog: MenuCatalogSnapshot) {
    state.catalog = catalog;
    state.status = 'ready';
    state.error = null;
    state.isDirty = false;
    state.selection = normalizeSelection(catalog, state.selection);
  }

  function createMissingCatalogError() {
    return {
      statusCode: 0,
      reason: 'unexpected-response' as const,
      message: 'Структурный снимок каталога ещё не загружен.',
    };
  }

  function clear() {
    state.status = 'idle';
    state.catalog = null;
    state.error = null;
    state.isDirty = false;
    state.selection = createEmptySelection();
  }

  async function load(accessToken: string) {
    state.status = 'loading';
    state.error = null;

    try {
      commitCatalog(await menuCatalogApi.getCatalog(accessToken));
    } catch (error) {
      state.status = 'error';
      state.error = normalizeBackofficeMenuCatalogError(error);
    }
  }

  async function initialize(accessToken: string) {
    if (state.catalog) {
      state.status = 'ready';
      return;
    }

    if (pendingInitialization) {
      await pendingInitialization;
      return;
    }

    pendingInitialization = load(accessToken).finally(() => {
      pendingInitialization = null;
    });
    await pendingInitialization;
  }

  async function reload(accessToken: string) {
    await load(accessToken);
  }

  function replaceCatalog(catalog: MenuCatalogSnapshot) {
    commitCatalog(catalog);
  }

  function updateDraft(mutator: (catalog: MenuCatalogSnapshot) => void): boolean {
    if (!state.catalog) {
      state.status = 'error';
      state.error = createMissingCatalogError();
      return false;
    }

    mutator(state.catalog);
    state.status = 'ready';
    state.error = null;
    state.isDirty = true;
    state.selection = normalizeSelection(state.catalog, state.selection);
    return true;
  }

  function addCategory(name: string): MenuCatalogCategory | null {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return null;
    }

    const category: MenuCatalogCategory = {
      menuCategoryId: createId('cat'),
      name: trimmedName,
      optionGroupRefs: [],
    };

    const updated = updateDraft((catalog) => {
      catalog.categories.push(category);
    });

    if (!updated) {
      return null;
    }

    state.selection = normalizeSelection(state.catalog, {
      categoryId: category.menuCategoryId,
      productId: null,
      optionGroupId: null,
    });
    return category;
  }

  function updateCategoryName(categoryId: string, name: string): boolean {
    const trimmedName = name.trim();

    if (!state.catalog || !trimmedName) {
      return false;
    }

    if (!findCategory(state.catalog, categoryId)) {
      return false;
    }

    return updateDraft((catalog) => {
      const category = findCategory(catalog, categoryId);

      category!.name = trimmedName;
    });
  }

  function toMenuCatalogItem(
    menuItemId: string,
    menuCategoryId: string,
    productDraft: MenuCatalogProductDraft,
  ): MenuCatalogItem {
    return {
      menuItemId,
      menuCategoryId,
      name: productDraft.name.trim(),
      itemType: productDraft.itemType,
      basePrice: productDraft.basePrice,
      sizePrices: productDraft.sizePrices.map((sizePrice) => ({ ...sizePrice })),
    };
  }

  function addProduct(
    categoryId: string,
    productDraft: MenuCatalogProductDraft,
  ): MenuCatalogItem | null {
    if (!state.catalog || !productDraft.name.trim() || !findCategory(state.catalog, categoryId)) {
      return null;
    }

    const product = toMenuCatalogItem(createId('item'), categoryId, productDraft);
    const updated = updateDraft((catalog) => {
      catalog.items.push(product);
    });

    if (!updated) {
      return null;
    }

    state.selection = normalizeSelection(state.catalog, {
      categoryId,
      productId: product.menuItemId,
      optionGroupId: null,
    });
    return product;
  }

  function updateProduct(productId: string, productDraft: MenuCatalogProductDraft): boolean {
    if (!state.catalog || !productDraft.name.trim()) {
      return false;
    }

    const product = findMenuCatalogProduct(state.catalog, productId);

    if (!product) {
      return false;
    }

    return updateDraft((catalog) => {
      const draftProduct = findMenuCatalogProduct(catalog, productId);

      Object.assign(
        draftProduct!,
        toMenuCatalogItem(productId, draftProduct!.menuCategoryId, productDraft),
      );
    });
  }

  async function save(accessToken: string): Promise<MenuCatalogSnapshot | null> {
    if (!state.catalog) {
      state.status = 'error';
      state.error = createMissingCatalogError();
      return null;
    }

    state.status = 'saving';
    state.error = null;

    try {
      const catalog = await menuCatalogApi.saveCatalog(accessToken, state.catalog);
      commitCatalog(catalog);
      return catalog;
    } catch (error) {
      state.status = 'error';
      state.error = normalizeBackofficeMenuCatalogError(error);
      return null;
    }
  }

  function syncNavigation(routeName: MenuCatalogRouteName, params: Record<string, unknown>) {
    state.selection = normalizeSelection(state.catalog, {
      categoryId:
        routeName === 'menu.menu_products' ||
        routeName === 'menu.menu_product_detail' ||
        routeName === 'menu.addon_group_detail'
          ? readRouteParam(params.categoryId)
          : null,
      productId:
        routeName === 'menu.menu_product_detail' ? readRouteParam(params.productId) : null,
      optionGroupId:
        routeName === 'menu.addon_group_detail' ? readRouteParam(params.optionGroupId) : null,
    });
  }

  return {
    addCategory,
    addProduct,
    clear,
    initialize,
    reload,
    replaceCatalog,
    save,
    syncNavigation,
    state,
    updateCategoryName,
    updateDraft,
    updateProduct,
  };
}

export const menuCatalogStore = createMenuCatalogStore({
  menuCatalogApi: new BackofficeMenuCatalogApi(appEnvironment.apiBaseUrl),
});

export function resetMenuCatalogStoreForTesting() {
  menuCatalogStore.clear();
}
