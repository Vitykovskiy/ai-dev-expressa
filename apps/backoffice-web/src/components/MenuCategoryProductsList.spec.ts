import { mount } from '@vue/test-utils';
import MenuCategoryProductsList from './MenuCategoryProductsList.vue';

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
  template: '<div v-bind="$attrs"><slot name="actions" /></div>',
};

const MenuListRowStub = {
  name: 'MenuListRow',
  emits: ['click'],
  template:
    '<button v-bind="$attrs" @click="$emit(\'click\')"><slot name="leading" /><slot /><slot name="meta" /><slot name="trailing" /></button>',
};

const MenuSurfaceCardStub = {
  name: 'MenuSurfaceCard',
  template: '<div v-bind="$attrs"><slot /></div>',
};

function mountComponent({
  categoryName = 'Кофе',
  optionGroups = [],
  products = [],
}: {
  categoryName?: string | null;
  optionGroups?: Array<{ name: string; optionGroupId: string }>;
  products?: Array<{
    itemTypeLabel: string;
    itemTypeShortLabel: string;
    name: string;
    priceSummary: string;
    productId: string;
  }>;
} = {}) {
  return mount(MenuCategoryProductsList, {
    props: {
      categoryName,
      optionGroups,
      products,
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

describe('MenuCategoryProductsList', () => {
  it('shows the empty state CTA and addon group action when category has no products', async () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="menu-products-empty"]').exists()).toBe(true);

    await wrapper.find('[data-testid="create-product-empty"]').trigger('click');
    await wrapper.find('[data-testid="create-addon-group"]').trigger('click');

    expect(wrapper.emitted('createProduct')).toEqual([[]]);
    expect(wrapper.emitted('createAddonGroup')).toEqual([[]]);
  });

  it('renders product rows and inherited addon groups for a filled category', async () => {
    const wrapper = mountComponent({
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
          itemTypeLabel: 'Напиток',
          itemTypeShortLabel: 'S/M/L',
          priceSummary: 'S 210 ₽ · M 250 ₽ · L 290 ₽',
        },
      ],
    });

    expect(wrapper.find('[data-testid="menu-products-list"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="menu-products-empty"]').exists()).toBe(false);

    await wrapper.find('[data-testid="product-row-item-latte"]').trigger('click');
    await wrapper.find('[data-testid="open-addon-group-group-milk"]').trigger('click');

    expect(wrapper.emitted('openProduct')).toEqual([['item-latte']]);
    expect(wrapper.emitted('openAddonGroup')).toEqual([['group-milk']]);
  });
});
