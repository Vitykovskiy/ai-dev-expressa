import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuAddonGroupDetailPage from './MenuAddonGroupDetailPage.vue';
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
  props: ['categories', 'initialCategoryId', 'mode', 'optionGroup'],
  emits: ['cancel', 'submit'],
  template: '<div data-testid="addon-group-editor" />',
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
        MenuAddonGroupEditorForm: MenuAddonGroupEditorFormStub,
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
    expect(editor.props('initialCategoryId')).toBe('cat-coffee');
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
  });
});
