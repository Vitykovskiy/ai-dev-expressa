import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuProductDetailPage from './MenuProductDetailPage.vue';
import { menuCatalogStore, resetMenuCatalogStoreForTesting } from '../stores/menu-catalog-store';

const routeMock = vi.hoisted(() => ({
  params: {
    productId: 'new',
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

const MenuProductEditorFormStub = {
  name: 'MenuProductEditorForm',
  props: ['categoryName', 'mode', 'product'],
  emits: ['cancel', 'submit'],
  template: '<div data-testid="product-editor" />',
};

function createCatalogSnapshot(): MenuCatalogSnapshot {
  return {
    categories: [
      {
        menuCategoryId: 'cat-coffee',
        name: 'Кофе',
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
    ],
    optionGroups: [],
  };
}

function mountPage() {
  return shallowMount(MenuProductDetailPage, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        MenuProductEditorForm: MenuProductEditorFormStub,
      },
    },
  });
}

describe('MenuProductDetailPage', () => {
  beforeEach(() => {
    routeMock.params.productId = 'new';
    routerMocks.push.mockReset();
    routerMocks.replace.mockReset();
    resetMenuCatalogStoreForTesting();
  });

  it('creates a product through the shared catalog draft', async () => {
    menuCatalogStore.replaceCatalog({
      categories: createCatalogSnapshot().categories,
      items: [],
      optionGroups: [],
    });
    menuCatalogStore.syncNavigation('menu.menu_product_detail', {
      categoryId: 'cat-coffee',
      productId: 'new',
    });
    const wrapper = mountPage();
    const editor = wrapper.findComponent({ name: 'MenuProductEditorForm' });

    expect(editor.props('mode')).toBe('create');
    expect(editor.props('categoryName')).toBe('Кофе');

    editor.vm.$emit('submit', {
      name: 'Раф',
      itemType: 'drink',
      basePrice: null,
      sizePrices: [
        { size: 'S', price: 210 },
        { size: 'M', price: 250 },
        { size: 'L', price: 290 },
      ],
    });
    await nextTick();

    expect(menuCatalogStore.state.catalog?.items[0]).toMatchObject({
      menuCategoryId: 'cat-coffee',
      name: 'Раф',
      itemType: 'drink',
      basePrice: null,
    });
    expect(menuCatalogStore.state.isDirty).toBe(true);
    expect(routerMocks.replace).toHaveBeenCalledWith({
      name: 'menu.menu_product_detail',
      params: {
        categoryId: 'cat-coffee',
        productId: expect.stringMatching(/^item-/),
      },
    });
  });

  it('edits an existing product through the shared catalog draft', async () => {
    routeMock.params.productId = 'item-latte';
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.menu_product_detail', {
      categoryId: 'cat-coffee',
      productId: 'item-latte',
    });
    const wrapper = mountPage();
    const editor = wrapper.findComponent({ name: 'MenuProductEditorForm' });

    expect(editor.props('mode')).toBe('edit');
    expect(editor.props('product').name).toBe('Латте');

    editor.vm.$emit('submit', {
      name: 'Круассан',
      itemType: 'product',
      basePrice: 180,
      sizePrices: [],
    });
    await nextTick();

    expect(menuCatalogStore.state.catalog?.items[0]).toEqual({
      menuItemId: 'item-latte',
      menuCategoryId: 'cat-coffee',
      name: 'Круассан',
      itemType: 'product',
      basePrice: 180,
      sizePrices: [],
    });
    expect(menuCatalogStore.state.isDirty).toBe(true);
  });
});
