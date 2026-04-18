import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuProductsPage from './MenuProductsPage.vue';
import {
  createMenuAddonGroupDetailRoute,
  createMenuCategoriesRoute,
  createMenuNewAddonGroupRoute,
  createMenuNewProductRoute,
  createMenuProductDetailRoute,
} from '../router/menu-catalog-navigation';
import { menuCatalogStore, resetMenuCatalogStoreForTesting } from '../stores/menu-catalog-store';

const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerMocks.push,
  }),
}));

const MenuActionButtonStub = {
  name: 'MenuActionButton',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
};

const MenuCategoryProductsListStub = {
  name: 'MenuCategoryProductsList',
  props: ['categoryName', 'optionGroups', 'products'],
  emits: ['createAddonGroup', 'createProduct', 'openAddonGroup', 'openProduct'],
  template: `
    <div data-testid="products-list">
      <button data-testid="emit-create-product" @click="$emit('createProduct')">create product</button>
      <button data-testid="emit-create-addon-group" @click="$emit('createAddonGroup')">create addon group</button>
      <button data-testid="emit-open-product" @click="$emit('openProduct', products[0]?.productId)">open product</button>
      <button data-testid="emit-open-addon-group" @click="$emit('openAddonGroup', optionGroups[0]?.optionGroupId)">open addon group</button>
    </div>
  `,
};

const MenuSectionHeaderStub = {
  name: 'MenuSectionHeader',
  template: '<div data-testid="menu-section-header"><slot name="actions" /></div>',
};

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
          {
            size: 'S',
            price: 210,
          },
          {
            size: 'M',
            price: 250,
          },
          {
            size: 'L',
            price: 290,
          },
        ],
      },
    ],
    optionGroups: [
      {
        optionGroupId: 'group-milk',
        name: 'Молоко',
        selectionMode: 'single',
        options: [],
      },
    ],
  };
}

function mountPage() {
  return shallowMount(MenuProductsPage, {
    global: {
      stubs: {
        MenuActionButton: MenuActionButtonStub,
        MenuCategoryProductsList: MenuCategoryProductsListStub,
        MenuSectionHeader: MenuSectionHeaderStub,
      },
    },
  });
}

describe('MenuProductsPage', () => {
  beforeEach(() => {
    routerMocks.push.mockReset();
    resetMenuCatalogStoreForTesting();
  });

  it('passes selected category data into the product list component', () => {
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.menu_products', {
      categoryId: 'cat-coffee',
    });

    const wrapper = mountPage();
    const list = wrapper.findComponent({ name: 'MenuCategoryProductsList' });

    expect(list.props('categoryName')).toBe('Кофе');
    expect(list.props('optionGroups')).toEqual([
      {
        optionGroupId: 'group-milk',
        name: 'Молоко',
      },
    ]);
    expect(list.props('products')).toEqual([
      {
        productId: 'item-latte',
        name: 'Латте',
        itemTypeLabel: 'Напиток',
        itemTypeShortLabel: 'S/M/L',
        priceSummary: 'S 210 ₽ · M 250 ₽ · L 290 ₽',
      },
    ]);
  });

  it('navigates between category list, product detail and addon group routes', async () => {
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.menu_products', {
      categoryId: 'cat-coffee',
    });

    const wrapper = mountPage();
    const list = wrapper.findComponent({ name: 'MenuCategoryProductsList' });

    await wrapper.find('[data-testid="create-product"]').trigger('click');
    await wrapper.find('[data-testid="back-to-categories"]').trigger('click');
    list.vm.$emit('openProduct', 'item-latte');
    list.vm.$emit('createAddonGroup');
    list.vm.$emit('openAddonGroup', 'group-milk');
    await nextTick();

    expect(routerMocks.push).toHaveBeenNthCalledWith(1, createMenuNewProductRoute('cat-coffee'));
    expect(routerMocks.push).toHaveBeenNthCalledWith(2, createMenuCategoriesRoute());
    expect(routerMocks.push).toHaveBeenNthCalledWith(
      3,
      createMenuProductDetailRoute('cat-coffee', 'item-latte'),
    );
    expect(routerMocks.push).toHaveBeenNthCalledWith(
      4,
      createMenuNewAddonGroupRoute('cat-coffee'),
    );
    expect(routerMocks.push).toHaveBeenNthCalledWith(
      5,
      createMenuAddonGroupDetailRoute('cat-coffee', 'group-milk'),
    );
  });
});
