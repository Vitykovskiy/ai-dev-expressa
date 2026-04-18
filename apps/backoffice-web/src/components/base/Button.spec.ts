import { mount } from '@vue/test-utils';
import Button from './Button.vue';
import { vuetify } from '../../vuetify';

describe('Button', () => {
  it('renders the default slot and applies the primary variant', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Confirm',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Confirm');
    expect(wrapper.classes()).toContain('base-button--variant-primary');
  });

  it('emits click and applies the requested variant', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'destructive',
      },
      slots: {
        default: 'Delete',
      },
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.classes()).toContain('base-button--variant-destructive');
  });

  it('does not emit click while disabled or loading', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
        loading: true,
      },
      slots: {
        default: 'Save',
      },
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });

  it('renders prepend and append slots', () => {
    const wrapper = mount(Button, {
      slots: {
        prepend: '<span>Left</span>',
        default: 'Navigate',
        append: '<span>Right</span>',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Left');
    expect(wrapper.text()).toContain('Navigate');
    expect(wrapper.text()).toContain('Right');
  });
});
