import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuProductDetailPage from './MenuProductDetailPage.vue';
import { createMenuProductsRoute } from '../router/menu-catalog-navigation';
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
  props: ['categoryName', 'formId', 'mode', 'product', 'submitError', 'submitPending'],
  emits: ['cancel', 'submit'],
  template: '<div data-testid="product-editor" />',
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
  emits: ['click'],
  template:
    '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /><slot name="meta" /></button>',
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
        MenuActionButton: MenuActionButtonStub,
        MenuBadge: MenuBadgeStub,
        MenuDialogShell: MenuDialogShellStub,
        MenuProductEditorForm: MenuProductEditorFormStub,
        MenuListRow: MenuListRowStub,
        MenuSectionHeader: MenuSectionHeaderStub,
        MenuSurfaceCard: MenuSurfaceCardStub,
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
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Товар «Раф» добавлен в общий черновик каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
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
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Товар «Круассан» обновлён в общем черновике каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });

  it('deletes an existing product from the shared catalog draft and returns to the list', async () => {
    routeMock.params.productId = 'item-latte';
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    menuCatalogStore.syncNavigation('menu.menu_product_detail', {
      categoryId: 'cat-coffee',
      productId: 'item-latte',
    });

    const wrapper = mountPage();

    await wrapper.find('[data-testid="delete-product"]').trigger('click');
    await nextTick();
    await wrapper.find('[data-testid="confirm-delete-product"]').trigger('click');
    await nextTick();

    expect(menuCatalogStore.state.catalog?.items).toEqual([]);
    expect(menuCatalogStore.state.isDirty).toBe(true);
    expect(routerMocks.push).toHaveBeenCalledWith(createMenuProductsRoute('cat-coffee'));
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Товар «Латте» удалён из общего черновика каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });
});
