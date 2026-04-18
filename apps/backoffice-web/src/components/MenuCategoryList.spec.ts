import { mount } from '@vue/test-utils';
import MenuCategoryList from './MenuCategoryList.vue';

const MenuActionButtonStub = {
  name: 'MenuActionButton',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
};

const MenuBadgeStub = {
  name: 'MenuBadge',
  template: '<span><slot /></span>',
};

const MenuEmptyStateStub = {
  name: 'MenuEmptyState',
  template: '<div><slot name="actions" /></div>',
};

const MenuListRowStub = {
  name: 'MenuListRow',
  emits: ['click'],
  template:
    '<button v-bind="$attrs" @click="$emit(\'click\')"><slot name="leading" /><slot /><slot name="meta" /><slot name="trailing" /></button>',
};

const MenuSurfaceCardStub = {
  name: 'MenuSurfaceCard',
  template: '<div><slot /></div>',
};

function mountComponent(
  categories: Array<{
    categoryId: string;
    name: string;
    optionGroupCount: number;
    optionGroups: Array<{ name: string; optionGroupId: string }>;
    products: Array<{ name: string; priceSummary: string; productId: string }>;
    productCount: number;
  }>,
) {
  return mount(MenuCategoryList, {
    props: {
      categories,
    },
    global: {
      stubs: {
        MenuActionButton: MenuActionButtonStub,
        MenuBadge: MenuBadgeStub,
        MenuEmptyState: MenuEmptyStateStub,
        MenuListRow: MenuListRowStub,
        MenuSurfaceCard: MenuSurfaceCardStub,
      },
    },
  });
}

describe('MenuCategoryList', () => {
  it('emits createCategory from the empty state CTA', async () => {
    const wrapper = mountComponent([]);

    await wrapper.find('[data-testid="create-category-empty"]').trigger('click');

    expect(wrapper.emitted('createCategory')).toEqual([[]]);
  });

  it('toggles a category branch and emits actions from the expanded panel', async () => {
    const wrapper = mountComponent([
      {
        categoryId: 'cat-coffee',
        name: 'Кофе',
        optionGroupCount: 1,
        optionGroups: [
          {
            optionGroupId: 'group-milk',
            name: 'Молоко',
          },
        ],
        products: [
          {
            productId: 'item-latte',
            name: 'Латте',
            priceSummary: 'S 210 ₽ · M 250 ₽ · L 290 ₽',
          },
        ],
        productCount: 1,
      },
    ]);

    expect(wrapper.find('[data-testid="category-panel-cat-coffee"]').exists()).toBe(false);

    await wrapper.find('[data-testid="toggle-category-cat-coffee"]').trigger('click');

    expect(wrapper.find('[data-testid="category-panel-cat-coffee"]').exists()).toBe(true);

    await wrapper.find('[data-testid="open-products-cat-coffee"]').trigger('click');
    await wrapper.find('[data-testid="edit-category-cat-coffee"]').trigger('click');
    await wrapper.find('[data-testid="create-category-addon-group-cat-coffee"]').trigger('click');
    await wrapper.find('[data-testid="open-addon-group-cat-coffee-group-milk"]').trigger('click');
    await wrapper.findComponent(MenuListRowStub).trigger('click');

    expect(wrapper.emitted('openProducts')).toEqual([['cat-coffee'], ['cat-coffee']]);
    expect(wrapper.emitted('editCategory')).toEqual([['cat-coffee']]);
    expect(wrapper.emitted('createAddonGroup')).toEqual([['cat-coffee']]);
    expect(wrapper.emitted('openAddonGroup')).toEqual([['cat-coffee', 'group-milk']]);
  });
});
