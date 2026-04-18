import { mount } from '@vue/test-utils';
import FilterTabs from './FilterTabs.vue';
import { vuetify } from '../../vuetify';

describe('FilterTabs', () => {
  it('renders items and the active state', () => {
    const wrapper = mount(FilterTabs, {
      props: {
        items: [
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
        ],
        modelValue: 'active',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="filter-tabs"]').classes()).not.toContain('filter-tabs--sticky');
    expect(wrapper.get('.filter-tabs__item--active').text()).toBe('Active');
  });

  it('emits update:modelValue on item click and respects disabled items', async () => {
    const wrapper = mount(FilterTabs, {
      props: {
        items: [
          { id: 'all', label: 'All' },
          { id: 'archived', label: 'Archived', disabled: true },
        ],
        modelValue: 'all',
        sticky: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.get('[role="tab"][type="button"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([['all']]);
    expect(wrapper.get('[data-testid="filter-tabs"]').classes()).toContain('filter-tabs--sticky');

    await wrapper.findAll('[role="tab"]')[1].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
  });
});
