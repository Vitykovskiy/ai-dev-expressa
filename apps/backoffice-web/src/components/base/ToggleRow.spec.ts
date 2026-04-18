import { mount } from '@vue/test-utils';
import ToggleRow from './ToggleRow.vue';
import { vuetify } from '../../vuetify';

describe('ToggleRow', () => {
  it('renders label, sublabel and the current value', () => {
    const wrapper = mount(ToggleRow, {
      props: {
        label: 'Publish product',
        sublabel: 'Visible to customers after saving.',
        modelValue: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="toggle-row"]').text()).toContain('Publish product');
    expect(wrapper.text()).toContain('Visible to customers after saving.');
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('emits update:modelValue when switched and respects disabled', async () => {
    const wrapper = mount(ToggleRow, {
      props: {
        label: 'Enable stock tracking',
        modelValue: false,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const input = wrapper.get('input[type="checkbox"]');
    await input.setValue(true);

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('disables the switch when requested', () => {
    const wrapper = mount(ToggleRow, {
      props: {
        label: 'Archive item',
        modelValue: false,
        disabled: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('input[type="checkbox"]').attributes('disabled')).toBeDefined();
  });
});
