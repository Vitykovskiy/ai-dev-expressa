import { mount } from '@vue/test-utils';
import StatusBadge from './StatusBadge.vue';
import { vuetify } from '../../vuetify';

describe('StatusBadge', () => {
  it('renders a Russian label for a system status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Created',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toBe('Создан');
    expect(wrapper.classes()).toContain('status-badge--variant-accent');
  });

  it('lets the manual label override the derived status label', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'Rejected',
        label: 'Требует проверки',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toBe('Требует проверки');
    expect(wrapper.classes()).toContain('status-badge--variant-destructive');
  });

  it('supports a standalone visual variant', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        variant: 'success',
        label: 'Готово',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toBe('Готово');
    expect(wrapper.classes()).toContain('status-badge--variant-success');
  });
});
