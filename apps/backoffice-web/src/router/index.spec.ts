import { router, resolveBackofficeRouteGuard } from './index';
import { shouldConfirmMenuCatalogLeave } from './menu-catalog-leave-confirmation';
import {
  backofficeAccessStore,
  resetBackofficeAccessStoreForTesting,
} from '../stores/backoffice-access-store';
import {
  menuCatalogStore,
  resetMenuCatalogStoreForTesting,
} from '../stores/menu-catalog-store';

describe('backoffice router', () => {
  beforeEach(() => {
    resetBackofficeAccessStoreForTesting();
    resetMenuCatalogStoreForTesting();
  });

  it('redirects the root path to the orders screen', async () => {
    backofficeAccessStore.state.status = 'error';
    await router.push('/');
    await router.isReady();

    expect(router.currentRoute.value.fullPath).toBe('/orders');
    expect(router.currentRoute.value.name).toBe('orders');
  });

  it('keeps all expected placeholder routes available', () => {
    const routeNames = router
      .getRoutes()
      .map((route) => route.name)
      .filter((name): name is string => typeof name === 'string');

    expect(routeNames).toEqual(
      expect.arrayContaining([
        'orders',
        'availability',
        'menu',
        'menu.menu_categories',
        'menu.menu_products',
        'menu.menu_product_detail',
        'menu.addon_group_detail',
        'users',
        'settings',
        'access-denied',
      ]),
    );
  });

  it('redirects the menu root path to categories without an empty child route', async () => {
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.accessToken = 'token-1';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability', 'menu', 'users', 'settings'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: true,
      },
    };
    menuCatalogStore.replaceCatalog({
      categories: [],
      items: [],
      optionGroups: [],
    });
    const menuRoute = router.options.routes.find((route) => route.name === 'menu');

    expect(menuRoute?.redirect).toEqual({ name: 'menu.menu_categories' });
    expect(menuRoute?.children).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '',
          name: undefined,
        }),
      ]),
    );

    await router.push('/menu');

    expect(router.currentRoute.value.fullPath).toBe('/menu/categories');
    expect(router.currentRoute.value.name).toBe('menu.menu_categories');
  });

  it('denies direct navigation to a tab missing in availableTabs', async () => {
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['barista'],
        blocked: false,
        isPrimaryAdministrator: false,
      },
    };

    await router.push('/users');

    expect(router.currentRoute.value.name).toBe('access-denied');
    expect(router.currentRoute.value.query.deniedTab).toBe('users');
    expect(router.currentRoute.value.query.deniedPath).toBe('/users');
  });

  it('applies the administrator menu guard to nested menu routes', async () => {
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.accessToken = 'token-1';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['barista'],
        blocked: false,
        isPrimaryAdministrator: false,
      },
    };

    await router.push('/menu/categories');

    expect(router.currentRoute.value.name).toBe('access-denied');
    expect(router.currentRoute.value.query.deniedTab).toBe('menu');
    expect(router.currentRoute.value.query.deniedPath).toBe('/menu/categories');
  });

  it('keeps nested menu routes available and syncs selected entities for administrator', async () => {
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.accessToken = 'token-1';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability', 'menu', 'users', 'settings'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: true,
      },
    };
    menuCatalogStore.replaceCatalog({
      categories: [
        {
          menuCategoryId: 'cat-coffee',
          name: 'Кофе',
          optionGroupRefs: ['group-milk'],
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
    });

    await router.push('/menu/categories/cat-coffee/products/item-latte');

    expect(router.currentRoute.value.name).toBe('menu.menu_product_detail');
    expect(menuCatalogStore.state.selection).toEqual({
      categoryId: 'cat-coffee',
      productId: 'item-latte',
      optionGroupId: null,
    });
  });

  it('blocks leaving menu when the shared draft is dirty and opens the leave confirmation', async () => {
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.accessToken = 'token-1';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability', 'menu', 'users', 'settings'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: true,
      },
    };
    menuCatalogStore.replaceCatalog({
      categories: [],
      items: [],
      optionGroups: [],
    });

    await router.push('/menu/categories');
    menuCatalogStore.addCategory('Завтраки');
    await router.push('/orders');

    expect(router.currentRoute.value.name).toBe('menu.menu_categories');
    expect(menuCatalogStore.state.ui.pendingLeave).toEqual({
      isOpen: true,
      targetPath: '/orders',
    });
  });

  it('allows the new product route inside an existing category', async () => {
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.accessToken = 'token-1';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability', 'menu', 'users', 'settings'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: true,
      },
    };
    menuCatalogStore.replaceCatalog({
      categories: [
        {
          menuCategoryId: 'cat-coffee',
          name: 'Кофе',
          optionGroupRefs: [],
        },
      ],
      items: [],
      optionGroups: [],
    });

    await router.push('/menu/categories/cat-coffee/products/new');

    expect(router.currentRoute.value.name).toBe('menu.menu_product_detail');
    expect(router.currentRoute.value.params.productId).toBe('new');
    expect(menuCatalogStore.state.selection).toEqual({
      categoryId: 'cat-coffee',
      productId: null,
      optionGroupId: null,
    });
  });

  it('keeps allowed routes available when the tab exists in availableTabs', () => {
    const guardResult = resolveBackofficeRouteGuard(
      {
        fullPath: '/availability',
        name: 'availability',
      },
      {
        status: 'ready',
        accessToken: 'token-1',
        context: {
          accessToken: 'token-1',
          channel: 'backoffice-telegram-entry',
          isTestMode: false,
          availableTabs: ['orders', 'availability'],
          user: {
            userId: 'user-1',
            telegramId: '500001',
            roles: ['barista'],
            blocked: false,
            isPrimaryAdministrator: false,
          },
        },
        error: null,
      },
    );

    expect(guardResult).toBe(true);
  });

  it('confirms leave only when navigation exits the menu route tree with a dirty draft', () => {
    expect(
      shouldConfirmMenuCatalogLeave({
        fromName: 'menu.menu_products',
        isDirty: true,
        toName: 'orders',
      }),
    ).toBe(true);
    expect(
      shouldConfirmMenuCatalogLeave({
        fromName: 'menu.menu_products',
        isDirty: true,
        toName: 'menu.menu_product_detail',
      }),
    ).toBe(false);
    expect(
      shouldConfirmMenuCatalogLeave({
        fromName: 'menu.menu_products',
        isDirty: false,
        toName: 'orders',
      }),
    ).toBe(false);
  });
});
