import { mount } from '@vue/test-utils';
import EmptyState from './EmptyState.vue';
import { vuetify } from '../../vuetify';

describe('EmptyState', () => {
  it('renders title, subtitle and icon slot', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'No orders yet',
        subtitle: 'New incoming orders will appear here.',
      },
      slots: {
        icon: '<span class="empty-state-icon">icon</span>',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('No orders yet');
    expect(wrapper.text()).toContain('New incoming orders will appear here.');
    expect(wrapper.find('.empty-state__icon').exists()).toBe(true);
  });

  it('renders default content and actions slots', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nothing found',
        subtitle: 'Try another filter',
      },
      slots: {
        default: '<div class="empty-state-body">Body content</div>',
        actions: '<button class="empty-state-action">Manual action</button>',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('.empty-state-body').exists()).toBe(true);
    expect(wrapper.find('.empty-state-action').exists()).toBe(true);
  });
});
