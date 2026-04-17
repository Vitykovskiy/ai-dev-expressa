import { ref } from 'vue';
import { describe, expect, it } from 'vitest';
import {
  buildBackofficeLayoutViewModel,
  useBackofficeLayoutState,
} from './backoffice-layout-state';
import type { BackofficeAccessState } from '../types';

function createAccessState(
  overrides: Partial<BackofficeAccessState> = {},
): BackofficeAccessState {
  return {
    status: 'idle',
    accessToken: null,
    context: null,
    error: null,
    ...overrides,
  };
}

describe('backoffice-layout-state', () => {
  it('returns loading content before the access context is ready', () => {
    const viewModel = buildBackofficeLayoutViewModel(createAccessState(), 'orders');

    expect(viewModel.blockingState?.kind).toBe('loading');
    expect(viewModel.heroTitle).toBe('Контекст доступа инициализируется');
    expect(viewModel.currentTab).toBe('orders');
    expect(viewModel.navigationItems).toHaveLength(5);
  });

  it('returns access denied content for pre-bootstrap Telegram failure', () => {
    const viewModel = buildBackofficeLayoutViewModel(
      createAccessState({
        status: 'error',
        error: {
          statusCode: 403,
          reason: 'telegram-context-required',
          message: 'Нужен Telegram-контекст.',
        },
      }),
      'unknown-route',
    );

    expect(viewModel.blockingState?.kind).toBe('access-denied');
    expect(viewModel.currentTab).toBeNull();
    expect(viewModel.heroTitle).toBe('Нужен Telegram-контекст');
    expect(viewModel.sessionLabel).toBe('Отказ в доступе');
    expect(viewModel.sessionSummary).toBe('Нужен Telegram-контекст.');
  });

  it('filters navigation and resolves the active item from the current route', () => {
    const viewModel = buildBackofficeLayoutViewModel(
      createAccessState({
        status: 'ready',
        accessToken: 'token-1',
        context: {
          accessToken: 'token-1',
          channel: 'backoffice-telegram-entry',
          isTestMode: false,
          availableTabs: ['orders', 'availability'],
          user: {
            userId: 'user-1',
            telegramId: '900001',
            roles: ['barista'],
            blocked: false,
            isPrimaryAdministrator: false,
          },
        },
      }),
      'availability',
    );

    expect(viewModel.blockingState).toBeNull();
    expect(viewModel.currentItem.label).toBe('Доступность');
    expect(viewModel.navigationItems.map((item) => item.tab)).toEqual([
      'orders',
      'availability',
    ]);
    expect(viewModel.heroText).toContain('barista');
  });

  it('keeps the view model reactive for route changes', () => {
    const routeName = ref<unknown>('orders');
    const accessState = createAccessState({
      status: 'ready',
      accessToken: 'token-1',
      context: {
        accessToken: 'token-1',
        channel: 'test-mode-without-telegram',
        isTestMode: true,
        availableTabs: ['orders', 'availability', 'menu'],
        user: {
          userId: 'user-1',
          telegramId: '900001',
          roles: ['administrator'],
          blocked: false,
          isPrimaryAdministrator: true,
        },
      },
    });

    const viewModel = useBackofficeLayoutState(accessState, routeName);

    expect(viewModel.value.currentItem.label).toBe('Заказы');
    expect(viewModel.value.heroChip).toBe('FEATURE-001 / test-mode session');

    routeName.value = 'menu';

    expect(viewModel.value.currentItem.label).toBe('Меню');
  });

  it('renders dedicated hero copy for the route access denied page', () => {
    const viewModel = buildBackofficeLayoutViewModel(
      createAccessState({
        status: 'ready',
        accessToken: 'token-1',
        context: {
          accessToken: 'token-1',
          channel: 'backoffice-telegram-entry',
          isTestMode: false,
          availableTabs: ['orders', 'availability'],
          user: {
            userId: 'user-1',
            telegramId: '900001',
            roles: ['barista'],
            blocked: false,
            isPrimaryAdministrator: false,
          },
        },
      }),
      'access-denied',
    );

    expect(viewModel.blockingState).toBeNull();
    expect(viewModel.currentTab).toBeNull();
    expect(viewModel.heroEyebrow).toContain('Route guard');
    expect(viewModel.heroTitle).toBe('Прямой переход по URL остановлен');
  });
});
