import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuAddonGroupDetailPage from './MenuAddonGroupDetailPage.vue';
import { createMenuProductsRoute } from '../router/menu-catalog-navigation';
import { menuCatalogStore, resetMenuCatalogStoreForTesting } from '../stores/menu-catalog-store';

const routeMock = vi.hoisted(() => ({
  params: {
    optionGroupId: 'new',
  } as Record<string, string>,
}));
const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  useRouter: () => ({
    push: routerMocks.push,
    replace: routerMocks.replace,
  }),
}));

const MenuAddonGroupEditorFormStub = {
  name: 'MenuAddonGroupEditorForm',
  props: [
    'categories',
    'formId',
    'initialCategoryId',
    'mode',
    'optionGroup',
    'submitError',
    'submitPending',
  ],
  emits: ['cancel', 'submit'],
  template: '<div data-testid="addon-group-editor" />',
};

const MenuActionButtonStub = {
  name: 'MenuActionButton',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
};

const MenuBadgeStub = {
  name: 'MenuBadge',
  template: '<span><slot /></span>',
};

const MenuDialogShellStub = {
  name: 'MenuDialogShell',
  props: ['label', 'maxWidth', 'modelValue', 'text', 'title'],
  emits: ['update:modelValue'],
  template: `
    <div v-if="modelValue" data-testid="delete-dialog">
      <slot />
      <slot name="actions" />
    </div>
  `,
};

const MenuListRowStub = {
  name: 'MenuListRow',
  template: '<div><slot /><slot name="meta" /></div>',
};

const MenuSectionHeaderStub = {
  name: 'MenuSectionHeader',
  template: '<div data-testid="menu-section-header"><slot name="actions" /></div>',
};

const MenuSurfaceCardStub = {
  name: 'MenuSurfaceCard',
  template: '<div v-bind="$attrs"><slot /></div>',
};

function createCatalogSnapshot(): MenuCatalogSnapshot {
  return {
    categories: [
      {
        menuCategoryId: 'cat-coffee',
        name: 'Coffee',
        optionGroupRefs: ['group-milk'],
      },
      {
        menuCategoryId: 'cat-desserts',
        name: 'Desserts',
        optionGroupRefs: ['group-milk'],
      },
    ],
    items: [
      {
        menuItemId: 'item-latte',
        menuCategoryId: 'cat-coffee',
        name: 'Latte',
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
        name: 'Cheesecake',
        itemType: 'product',
        basePrice: 260,
        sizePrices: [],
      },
    ],
    optionGroups: [
      {
        optionGroupId: 'group-milk',
        name: 'Milk',
        selectionMode: 'single',
        options: [
          {
            optionId: 'option-oat',
            name: 'Oat',
            priceDelta: 40,
          },
        ],
      },
    ],
  };
}

function mountPage() {
  return shallowMount(MenuAddonGroupDetailPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        MenuActionButton: MenuActionButtonStub,
        MenuAddonGroupEditorForm: MenuAddonGroupEditorFormStub,
        MenuBadge: MenuBadgeStub,
        MenuDialogShell: MenuDialogShellStub,
        MenuListRow: MenuListRowStub,
        MenuSectionHeader: MenuSectionHeaderStub,
        MenuSurfaceCard: MenuSurfaceCardStub,
      },
    },
  });
}

describe('MenuAddonGroupDetailPage', () => {
  beforeEach(() => {
    routeMock.params.optionGroupId = 'new';
    routerMocks.push.mockReset();
    routerMocks.replace.mockReset();
    resetMenuCatalogStoreForTesting();
  });

  it('creates an addon group through the shared catalog draft', async () => {
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.addon_group_detail', {
      categoryId: 'cat-coffee',
      optionGroupId: 'new',
    });
    const wrapper = mountPage();
    const editor = wrapper.findComponent({ name: 'MenuAddonGroupEditorForm' });

    expect(editor.props('mode')).toBe('create');
    expect(editor.props('formId')).toBe('menu-addon-group-editor-form');
    expect(editor.props('initialCategoryId')).toBe('cat-coffee');
    expect(editor.props('submitPending')).toBe(false);
    expect(editor.props('submitError')).toBeNull();
    expect(editor.props('categories')).toEqual([
      expect.objectContaining({
        menuCategoryId: 'cat-coffee',
        productCount: 1,
      }),
      expect.objectContaining({
        menuCategoryId: 'cat-desserts',
        productCount: 1,
      }),
    ]);

    editor.vm.$emit('submit', {
      categoryIds: ['cat-coffee'],
      name: 'Syrups',
      selectionMode: 'multiple',
      options: [
        {
          optionId: null,
          name: 'Vanilla',
          priceDelta: 35,
        },
      ],
    });
    await nextTick();

    const createdOptionGroup = menuCatalogStore.state.catalog?.optionGroups.find(
      (optionGroup) => optionGroup.name === 'Syrups',
    );

    expect(createdOptionGroup).toMatchObject({
      optionGroupId: expect.stringMatching(/^group-/),
      selectionMode: 'multiple',
      options: [
        expect.objectContaining({
          optionId: expect.stringMatching(/^option-/),
          name: 'Vanilla',
          priceDelta: 35,
        }),
      ],
    });
    expect(menuCatalogStore.state.catalog?.categories[0].optionGroupRefs).toContain(
      createdOptionGroup?.optionGroupId,
    );
    expect(menuCatalogStore.state.isDirty).toBe(true);
    expect(routerMocks.replace).toHaveBeenCalledWith({
      name: 'menu.addon_group_detail',
      params: {
        categoryId: 'cat-coffee',
        optionGroupId: createdOptionGroup?.optionGroupId,
      },
    });
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Группа «Syrups» добавлена в общий черновик каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });

  it('updates an addon group and reroutes when the current category binding is removed', async () => {
    routeMock.params.optionGroupId = 'group-milk';
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.addon_group_detail', {
      categoryId: 'cat-coffee',
      optionGroupId: 'group-milk',
    });
    const wrapper = mountPage();
    const editor = wrapper.findComponent({ name: 'MenuAddonGroupEditorForm' });

    expect(editor.props('mode')).toBe('edit');
    expect(editor.props('optionGroup')).toMatchObject({
      optionGroupId: 'group-milk',
      name: 'Milk',
    });

    editor.vm.$emit('submit', {
      categoryIds: ['cat-desserts'],
      name: 'Milk options',
      selectionMode: 'multiple',
      options: [
        {
          optionId: 'option-oat',
          name: 'Oat',
          priceDelta: 45,
        },
      ],
    });
    await nextTick();

    expect(menuCatalogStore.state.catalog?.optionGroups[0]).toMatchObject({
      optionGroupId: 'group-milk',
      name: 'Milk options',
      selectionMode: 'multiple',
      options: [
        {
          optionId: 'option-oat',
          name: 'Oat',
          priceDelta: 45,
        },
      ],
    });
    expect(menuCatalogStore.state.catalog?.categories).toEqual([
      expect.objectContaining({
        menuCategoryId: 'cat-coffee',
        optionGroupRefs: [],
      }),
      expect.objectContaining({
        menuCategoryId: 'cat-desserts',
        optionGroupRefs: ['group-milk'],
      }),
    ]);
    expect(routerMocks.replace).toHaveBeenCalledWith({
      name: 'menu.addon_group_detail',
      params: {
        categoryId: 'cat-desserts',
        optionGroupId: 'group-milk',
      },
    });
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Группа «Milk options» обновлена в общем черновике каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });

  it('deletes an existing addon group from the shared catalog draft and returns to products', async () => {
    routeMock.params.optionGroupId = 'group-milk';
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.addon_group_detail', {
      categoryId: 'cat-coffee',
      optionGroupId: 'group-milk',
    });

    const wrapper = mountPage();

    await wrapper.find('[data-testid="delete-addon-group"]').trigger('click');
    await nextTick();
    await wrapper.find('[data-testid="confirm-delete-addon-group"]').trigger('click');
    await nextTick();

    expect(menuCatalogStore.state.catalog?.optionGroups).toEqual([]);
    expect(menuCatalogStore.state.catalog?.categories).toEqual([
      expect.objectContaining({
        menuCategoryId: 'cat-coffee',
        optionGroupRefs: [],
      }),
      expect.objectContaining({
        menuCategoryId: 'cat-desserts',
        optionGroupRefs: [],
      }),
    ]);
    expect(menuCatalogStore.state.isDirty).toBe(true);
    expect(routerMocks.push).toHaveBeenCalledWith(createMenuProductsRoute('cat-coffee'));
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Группа «Milk» удалена из общего черновика каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });

  it('shows a context error when the route points to a missing addon group', () => {
    routeMock.params.optionGroupId = 'group-missing';
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.addon_group_detail', {
      categoryId: 'cat-coffee',
      optionGroupId: 'group-missing',
    });

    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="addon-group-detail-context-error"]').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'MenuAddonGroupEditorForm' }).exists()).toBe(false);
  });
});
