import { mount } from '@vue/test-utils';
import FormField from './FormField.vue';
import { vuetify } from '../../vuetify';

describe('FormField', () => {
  it('renders label, required mark, hint, error and control slot', () => {
    const wrapper = mount(FormField, {
      props: {
        label: 'Product name',
        hint: 'Use a short, descriptive title.',
        error: 'Name is required.',
        required: true,
      },
      slots: {
        default: '<input data-testid="field-control" />',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="form-field"]').text()).toContain('Product name');
    expect(wrapper.get('[data-testid="form-field"]').text()).toContain('*');
    expect(wrapper.get('[data-testid="form-field"]').text()).toContain('Use a short, descriptive title.');
    expect(wrapper.get('[data-testid="form-field"]').text()).toContain('Name is required.');
    expect(wrapper.find('[data-testid="field-control"]').exists()).toBe(true);
    expect(wrapper.emitted()).toEqual({});
  });

  it('renders only the provided control slot when no messages are passed', () => {
    const wrapper = mount(FormField, {
      props: {
        label: 'Description',
      },
      slots: {
        default: '<textarea data-testid="field-control">Body</textarea>',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="field-control"]').text()).toBe('Body');
    expect(wrapper.text()).not.toContain('Use a short, descriptive title.');
    expect(wrapper.text()).not.toContain('Name is required.');
    expect(wrapper.emitted()).toEqual({});
  });
});
