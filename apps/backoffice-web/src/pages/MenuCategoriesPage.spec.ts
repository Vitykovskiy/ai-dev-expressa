import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuCategoriesPage from './MenuCategoriesPage.vue';
import { menuCatalogStore, resetMenuCatalogStoreForTesting } from '../stores/menu-catalog-store';

const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerMocks.push,
  }),
}));

const MenuCategoryListStub = {
  name: 'MenuCategoryList',
  props: ['categories'],
  emits: ['createCategory', 'editCategory', 'openAddonGroup', 'openProducts'],
  template:
    '<div data-testid="category-list"><button data-testid="edit-category" @click="$emit(\'editCategory\', categories[0]?.categoryId)">Изменить</button></div>',
};

const MenuCategoryFormDialogStub = {
  name: 'MenuCategoryFormDialog',
  props: ['initialName', 'mode', 'modelValue', 'productCount'],
  emits: ['submit', 'update:modelValue'],
  template: '<div data-testid="category-dialog" />',
};

const MenuSectionHeaderStub = {
  name: 'MenuSectionHeader',
  template: '<div data-testid="menu-section-header"><slot name="actions" /></div>',
};

const MenuActionButtonStub = {
  name: 'MenuActionButton',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
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
    items: [],
    optionGroups: [],
  };
}

function mountPage() {
  return shallowMount(MenuCategoriesPage, {
    global: {
      stubs: {
        MenuActionButton: MenuActionButtonStub,
        MenuCategoryFormDialog: MenuCategoryFormDialogStub,
        MenuCategoryList: MenuCategoryListStub,
        MenuSectionHeader: MenuSectionHeaderStub,
      },
    },
  });
}

describe('MenuCategoriesPage', () => {
  beforeEach(() => {
    routerMocks.push.mockReset();
    resetMenuCatalogStoreForTesting();
  });

  it('creates a category through the shared catalog draft', async () => {
    menuCatalogStore.replaceCatalog({
      categories: [],
      items: [],
      optionGroups: [],
    });
    const wrapper = mountPage();

    await wrapper.find('[data-testid="create-category"]').trigger('click');
    const dialog = wrapper.findComponent({ name: 'MenuCategoryFormDialog' });

    expect(dialog.props('mode')).toBe('create');

    dialog.vm.$emit('submit', '  Завтраки  ');
    await nextTick();

    expect(menuCatalogStore.state.catalog?.categories).toHaveLength(1);
    expect(menuCatalogStore.state.catalog?.categories[0].name).toBe('Завтраки');
    expect(menuCatalogStore.state.isDirty).toBe(true);
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Категория «Завтраки» добавлена в общий черновик каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });

  it('edits an existing category through the shared catalog draft', async () => {
    menuCatalogStore.replaceCatalog(createCatalogSnapshot());
    const wrapper = mountPage();

    wrapper.findComponent({ name: 'MenuCategoryList' }).vm.$emit('editCategory', 'cat-coffee');
    await nextTick();

    const dialog = wrapper.findComponent({ name: 'MenuCategoryFormDialog' });

    expect(dialog.props('mode')).toBe('edit');
    expect(dialog.props('initialName')).toBe('Кофе');
    expect(dialog.props('productCount')).toBe(0);

    dialog.vm.$emit('submit', 'Кофе и чай');
    await nextTick();

    expect(menuCatalogStore.state.catalog?.categories[0].name).toBe('Кофе и чай');
    expect(menuCatalogStore.state.isDirty).toBe(true);
    expect(menuCatalogStore.state.ui.toast).toEqual({
      id: 1,
      text: 'Категория «Кофе и чай» обновлена в общем черновике каталога.',
      title: 'Черновик обновлён',
      tone: 'success',
    });
  });
});
