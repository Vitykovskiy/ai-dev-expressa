import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MenuAddonGroupEditorForm from './MenuAddonGroupEditorForm.vue';
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

const MenuListRowStub = {
  name: 'MenuListRow',
  template: '<label><slot name="leading" /><slot /><slot name="meta" /></label>',
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
  submitError = null,
  submitPending = false,
}: {
  submitError?: string | null;
  submitPending?: boolean;
} = {}) {
  return mount(MenuAddonGroupEditorForm, {
    props: {
      categories: [
        {
          menuCategoryId: 'cat-coffee',
          name: 'Кофе',
          optionGroupRefs: [],
          productCount: 3,
        },
      ],
      initialCategoryId: 'cat-coffee',
      mode: 'create',
      optionGroup: null,
      submitError,
      submitPending,
    },
    global: {
      plugins: [vuetify],
      stubs: {
        MenuActionButton: MenuActionButtonStub,
        MenuBadge: MenuBadgeStub,
        MenuListRow: MenuListRowStub,
        MenuSectionHeader: MenuSectionHeaderStub,
        MenuSurfaceCard: MenuSurfaceCardStub,
      },
    },
  });
}

async function setFieldValue(
  wrapper: ReturnType<typeof mountComponent>,
  testId: string,
  value: string,
) {
  const input = wrapper.get(`[data-testid="${testId}"] input`);

  await input.setValue(value);
  await nextTick();
}

describe('MenuAddonGroupEditorForm', () => {
  it('shows validation summary and blocks submit when required fields are missing', async () => {
    const wrapper = mountComponent();

    await setFieldValue(wrapper, 'addon-group-name-input', '');
    await setFieldValue(wrapper, 'addon-option-name-0', '');
    await setFieldValue(wrapper, 'addon-option-price-delta-0', '-1');
    await wrapper.get('input[type="checkbox"]').setValue(false);
    await wrapper.get('[data-testid="menu-addon-group-editor"]').trigger('submit');

    expect(wrapper.emitted('submit')).toBeUndefined();
    expect(wrapper.find('[data-testid="addon-group-validation-summary"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Выберите хотя бы одну категорию.');
    expect(wrapper.text()).toContain('Укажите название группы.');
    expect(wrapper.text()).toContain('Укажите название варианта 1.');
    expect(wrapper.text()).toContain('Доплата варианта 1 должна быть числом от 0.');
  });

  it('emits a trimmed draft when the form is valid', async () => {
    const wrapper = mountComponent();

    await setFieldValue(wrapper, 'addon-group-name-input', '  Сиропы  ');
    await setFieldValue(wrapper, 'addon-option-name-0', '  Ваниль  ');
    await setFieldValue(wrapper, 'addon-option-price-delta-0', '35,5');
    await wrapper.get('[data-testid="menu-addon-group-editor"]').trigger('submit');

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          categoryIds: ['cat-coffee'],
          name: 'Сиропы',
          selectionMode: 'single',
          options: [
            {
              optionId: null,
              name: 'Ваниль',
              priceDelta: 35.5,
            },
          ],
        },
      ],
    ]);
  });

  it('shows submit error text and disables the submit action while pending', () => {
    const wrapper = mountComponent({
      submitError: 'Не удалось обновить группу.',
      submitPending: true,
    });

    expect(wrapper.text()).toContain('Не удалось обновить группу.');
    expect(wrapper.get('[data-testid="submit-addon-group-form"]').attributes('disabled')).toBeDefined();
  });
});
