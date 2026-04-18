import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuProductEditorForm from './MenuProductEditorForm.vue';
import { vuetify } from '../vuetify';

const MenuActionButtonStub = {
  name: 'MenuActionButton',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
};

const MenuBadgeStub = {
  name: 'MenuBadge',
  template: '<span><slot /></span>',
};

const MenuSectionHeaderStub = {
  name: 'MenuSectionHeader',
  template: '<div><slot name="actions" /></div>',
};

const MenuSurfaceCardStub = {
  name: 'MenuSurfaceCard',
  template: '<div><slot /></div>',
};

function mountComponent({
  mode = 'create',
  submitError = null,
  submitPending = false,
}: {
  mode?: 'create' | 'edit';
  submitError?: string | null;
  submitPending?: boolean;
} = {}) {
  return mount(MenuProductEditorForm, {
    props: {
      categoryName: 'Кофе',
      mode,
      product: null,
      submitError,
      submitPending,
    },
    global: {
      plugins: [vuetify],
      stubs: {
        MenuActionButton: MenuActionButtonStub,
        MenuBadge: MenuBadgeStub,
        MenuSectionHeader: MenuSectionHeaderStub,
        MenuSurfaceCard: MenuSurfaceCardStub,
      },
    },
  });
}

async function setFieldValue(wrapper: ReturnType<typeof mountComponent>, testId: string, value: string) {
  const input = wrapper.get(`[data-testid="${testId}"] input`);

  await input.setValue(value);
  await nextTick();
}

describe('MenuProductEditorForm', () => {
  it('switches from product to drink mode and shows size inputs', async () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="product-base-price-input"]').exists()).toBe(true);

    await wrapper.get('[data-testid="select-drink-type"]').trigger('click');

    expect(wrapper.find('[data-testid="product-base-price-input"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="drink-size-price-S"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="drink-size-price-M"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="drink-size-price-L"]').exists()).toBe(true);
  });

  it('validates required drink size prices before emitting a draft', async () => {
    const wrapper = mountComponent();

    await wrapper.get('[data-testid="select-drink-type"]').trigger('click');
    await setFieldValue(wrapper, 'product-name-input', 'Латте');
    await setFieldValue(wrapper, 'drink-size-price-S', '190');
    await wrapper.get('[data-testid="menu-product-editor"]').trigger('submit');

    expect(wrapper.emitted('submit')).toBeUndefined();
    expect(wrapper.text()).toContain('Укажите цену размера M.');
    expect(wrapper.text()).toContain('Укажите цену размера L.');
    expect(wrapper.find('[data-testid="product-validation-summary"]').exists()).toBe(true);
  });

  it('emits a trimmed product draft with the base price', async () => {
    const wrapper = mountComponent();

    await setFieldValue(wrapper, 'product-name-input', '  Круассан  ');
    await setFieldValue(wrapper, 'product-base-price-input', '160,5');
    await wrapper.get('[data-testid="menu-product-editor"]').trigger('submit');

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          name: 'Круассан',
          itemType: 'product',
          basePrice: 160.5,
          sizePrices: [],
        },
      ],
    ]);
  });

  it('shows submit error text and disables the submit action while pending', () => {
    const wrapper = mountComponent({
      submitError: 'Не удалось обновить товар.',
      submitPending: true,
    });

    expect(wrapper.text()).toContain('Не удалось обновить товар.');
    expect(wrapper.get('[data-testid="submit-product-form"]').attributes('disabled')).toBeDefined();
  });
});
