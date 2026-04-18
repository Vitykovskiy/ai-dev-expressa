import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import {
  resolveMenuCatalogSavePanelState,
  resolveMenuCatalogShellState,
} from './menu-catalog-shell-state';
import type { MenuCatalogState } from '../types';

function createCatalogSnapshot(): MenuCatalogSnapshot {
  return {
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
  };
}

function createMenuState(overrides: Partial<MenuCatalogState> = {}): MenuCatalogState {
  return {
    status: 'ready',
    catalog: createCatalogSnapshot(),
    error: null,
    isDirty: false,
    selection: {
      categoryId: null,
      productId: null,
      optionGroupId: null,
    },
    ...overrides,
  };
}

describe('resolveMenuCatalogShellState', () => {
  it('returns an initialization block before the first catalog load starts', () => {
    const viewModel = resolveMenuCatalogShellState(
      createMenuState({
        status: 'idle',
        catalog: null,
      }),
      false,
    );

    expect(viewModel.blockingState?.kind).toBe('idle');
    expect(viewModel.heroBadge.tone).toBe('neutral');
    expect(viewModel.showSavePanel).toBe(false);
    expect(viewModel.canReload).toBe(false);
  });

  it('exposes a non-blocking warning only for reload errors over an existing snapshot', () => {
    const viewModel = resolveMenuCatalogShellState(
      createMenuState({
        status: 'error',
        error: {
          statusCode: 503,
          reason: 'network-error',
          message: 'Network request failed',
        },
      }),
      true,
    );

    expect(viewModel.blockingState).toBeNull();
    expect(viewModel.warningState).toEqual(
      expect.objectContaining({
        actionLabel: 'Повторить обновление',
      }),
    );
    expect(viewModel.savePanelError).toBeNull();
    expect(viewModel.canReload).toBe(true);
  });

  it('routes save errors to the save panel and blocks reload while the draft is dirty', () => {
    const error = {
      statusCode: 422,
      reason: 'invalid-option-group-rule' as const,
      message: 'Option group rule is invalid',
    };
    const viewModel = resolveMenuCatalogShellState(
      createMenuState({
        status: 'error',
        error,
        isDirty: true,
      }),
      true,
    );

    expect(viewModel.warningState).toBeNull();
    expect(viewModel.savePanelError).toEqual(error);
    expect(viewModel.statusSummary).toBe('Черновик');
    expect(viewModel.canReload).toBe(false);
  });

  it('marks the hero as saving and freezes reload while persistence is running', () => {
    const viewModel = resolveMenuCatalogShellState(
      createMenuState({
        status: 'saving',
        isDirty: true,
      }),
      true,
    );

    expect(viewModel.heroBadge).toEqual({
      emphasis: 'solid',
      label: 'Сохраняем изменения',
      tone: 'menu',
    });
    expect(viewModel.statusSummary).toBe('Сохранение');
    expect(viewModel.canReload).toBe(false);
  });
});

describe('resolveMenuCatalogSavePanelState', () => {
  it('returns a warning-style save CTA for a dirty draft', () => {
    const panelState = resolveMenuCatalogSavePanelState({
      disabled: false,
      error: null,
      isDirty: true,
      status: 'ready',
    });

    expect(panelState.badge.label).toBe('Есть черновик');
    expect(panelState.cardVariant).toBe('warning');
    expect(panelState.actionLabel).toBe('Сохранить каталог');
    expect(panelState.actionVariant).toBe('primary');
  });

  it('returns a danger state with inline error for failed saves', () => {
    const panelState = resolveMenuCatalogSavePanelState({
      disabled: false,
      error: {
        statusCode: 422,
        reason: 'invalid-option-group-rule',
        message: 'Option group rule is invalid',
      },
      isDirty: true,
      status: 'error',
    });

    expect(panelState.badge.tone).toBe('danger');
    expect(panelState.cardVariant).toBe('danger');
    expect(panelState.inlineError?.message).toBe('Option group rule is invalid');
    expect(panelState.actionLabel).toBe('Повторить сохранение');
  });

  it('returns a passive synchronized state when there is no draft', () => {
    const panelState = resolveMenuCatalogSavePanelState({
      disabled: false,
      error: null,
      isDirty: false,
      status: 'ready',
    });

    expect(panelState.badge).toEqual({
      emphasis: 'soft',
      label: 'Каталог синхронизирован',
      tone: 'success',
    });
    expect(panelState.cardVariant).toBe('subtle');
    expect(panelState.inlineError).toBeNull();
    expect(panelState.actionVariant).toBe('secondary');
  });
});
