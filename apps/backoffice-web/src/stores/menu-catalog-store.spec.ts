import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { createMenuCatalogStore, resolveMenuCategoryProducts } from './menu-catalog-store';

function createCatalogSnapshot(): MenuCatalogSnapshot {
  return {
    categories: [
      {
        menuCategoryId: 'cat-coffee',
        name: 'Кофе',
        optionGroupRefs: ['group-milk'],
      },
      {
        menuCategoryId: 'cat-desserts',
        name: 'Десерты',
        optionGroupRefs: [],
      },
    ],
    items: [
      {
        menuItemId: 'item-latte',
        menuCategoryId: 'cat-coffee',
        name: 'Латте',
        itemType: 'drink',
        basePrice: null,
        sizePrices: [
          { size: 'S', price: 190 },
          { size: 'M', price: 230 },
          { size: 'L', price: 270 },
        ],
      },
      {
        menuItemId: 'item-cheesecake',
        menuCategoryId: 'cat-desserts',
        name: 'Чизкейк',
        itemType: 'product',
        basePrice: 260,
        sizePrices: [],
      },
    ],
    optionGroups: [
      {
        optionGroupId: 'group-milk',
        name: 'Молоко',
        selectionMode: 'single',
        options: [
          {
            optionId: 'option-oat',
            name: 'Овсяное',
            priceDelta: 40,
          },
        ],
      },
    ],
  };
}

describe('createMenuCatalogStore', () => {
  it('loads the structural snapshot and exposes products by category', async () => {
    const snapshot = createCatalogSnapshot();
    const menuCatalogApi = {
      getCatalog: vi.fn().mockResolvedValue(snapshot),
      saveCatalog: vi.fn(),
    };
    const store = createMenuCatalogStore({ menuCatalogApi });

    await store.initialize('access-token');

    expect(menuCatalogApi.getCatalog).toHaveBeenCalledWith('access-token');
    expect(store.state.status).toBe('ready');
    expect(store.state.catalog).toEqual(snapshot);
    expect(resolveMenuCategoryProducts(store.state.catalog, 'cat-coffee')).toHaveLength(1);
  });

  it('saves the current draft and replaces the local snapshot with the server response', async () => {
    const snapshot = createCatalogSnapshot();
    const persistedSnapshot: MenuCatalogSnapshot = {
      ...snapshot,
      items: [
        ...snapshot.items,
        {
          menuItemId: 'item-flat-white',
          menuCategoryId: 'cat-coffee',
          name: 'Флэт уайт',
          itemType: 'drink',
          basePrice: null,
          sizePrices: [
            { size: 'S', price: 210 },
            { size: 'M', price: 250 },
            { size: 'L', price: 290 },
          ],
        },
      ],
    };
    const menuCatalogApi = {
      getCatalog: vi.fn().mockResolvedValue(snapshot),
      saveCatalog: vi.fn().mockResolvedValue(persistedSnapshot),
    };
    const store = createMenuCatalogStore({ menuCatalogApi });

    await store.initialize('access-token');
    store.replaceCatalog(persistedSnapshot);

    const result = await store.save('access-token');

    expect(menuCatalogApi.saveCatalog).toHaveBeenCalledWith('access-token', persistedSnapshot);
    expect(result).toEqual(persistedSnapshot);
    expect(store.state.catalog?.items).toHaveLength(3);
    expect(store.state.status).toBe('ready');
  });

  it('adds and edits categories in the local draft before saving the structural snapshot', async () => {
    const snapshot = createCatalogSnapshot();
    const menuCatalogApi = {
      getCatalog: vi.fn().mockResolvedValue(snapshot),
      saveCatalog: vi.fn().mockResolvedValue(snapshot),
    };
    const store = createMenuCatalogStore({
      createId: (prefix) => `${prefix}-new`,
      menuCatalogApi,
    });

    await store.initialize('access-token');

    const category = store.addCategory('  Завтраки  ');

    expect(category).toEqual({
      menuCategoryId: 'cat-new',
      name: 'Завтраки',
      optionGroupRefs: [],
    });
    expect(store.state.isDirty).toBe(true);
    expect(store.state.selection.categoryId).toBe('cat-new');

    expect(store.updateCategoryName('cat-new', '  Утреннее меню  ')).toBe(true);
    expect(store.state.catalog?.categories.find((item) => item.menuCategoryId === 'cat-new')?.name).toBe(
      'Утреннее меню',
    );
  });

  it('keeps the draft dirty and exposes the server save error when persistence fails', async () => {
    const snapshot = createCatalogSnapshot();
    const menuCatalogApi = {
      getCatalog: vi.fn().mockResolvedValue(snapshot),
      saveCatalog: vi.fn().mockRejectedValue({
        statusCode: 422,
        reason: 'invalid-option-group-rule',
        message: 'Option group rule is invalid',
      }),
    };
    const store = createMenuCatalogStore({
      createId: (prefix) => `${prefix}-new`,
      menuCatalogApi,
    });

    await store.initialize('access-token');
    store.addCategory('Завтраки');

    const result = await store.save('access-token');

    expect(result).toBeNull();
    expect(store.state.isDirty).toBe(true);
    expect(store.state.status).toBe('error');
    expect(store.state.error).toEqual({
      statusCode: 422,
      reason: 'invalid-option-group-rule',
      message: 'Option group rule is invalid',
    });
  });

  it('syncs route selection and clears invalid entities outside the selected category', async () => {
    const snapshot = createCatalogSnapshot();
    const menuCatalogApi = {
      getCatalog: vi.fn().mockResolvedValue(snapshot),
      saveCatalog: vi.fn(),
    };
    const store = createMenuCatalogStore({ menuCatalogApi });

    await store.initialize('access-token');
    store.syncNavigation('menu.menu_product_detail', {
      categoryId: 'cat-coffee',
      productId: 'item-latte',
    });

    expect(store.state.selection).toEqual({
      categoryId: 'cat-coffee',
      productId: 'item-latte',
      optionGroupId: null,
    });

    store.syncNavigation('menu.addon_group_detail', {
      categoryId: 'cat-desserts',
      optionGroupId: 'group-milk',
    });

    expect(store.state.selection).toEqual({
      categoryId: 'cat-desserts',
      productId: null,
      optionGroupId: null,
    });
  });
});
