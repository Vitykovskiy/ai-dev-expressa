import { router } from './index';

describe('backoffice router', () => {
  it('redirects the root path to the orders screen', async () => {
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
      ]),
    );
  });
});
