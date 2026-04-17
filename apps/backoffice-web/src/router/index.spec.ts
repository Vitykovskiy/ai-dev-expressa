import { router, resolveBackofficeRouteGuard } from './index';
import {
  backofficeAccessStore,
  resetBackofficeAccessStoreForTesting,
} from '../stores/backoffice-access-store';

describe('backoffice router', () => {
  beforeEach(() => {
    resetBackofficeAccessStoreForTesting();
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
        'users',
        'settings',
        'access-denied',
      ]),
    );
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
});
