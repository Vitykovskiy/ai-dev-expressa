import { mount } from '@vue/test-utils';
import SectionList from './SectionList.vue';
import { vuetify } from '../../vuetify';

describe('SectionList', () => {
  it('renders title, subtitle and default content', () => {
    const wrapper = mount(SectionList, {
      props: {
        title: 'Catalog',
        subtitle: 'Manage section entries',
      },
      slots: {
        default: '<div data-testid="section-body">Body content</div>',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="section-list"]').text()).toContain('Catalog');
    expect(wrapper.text()).toContain('Manage section entries');
    expect(wrapper.get('[data-testid="section-body"]').text()).toBe('Body content');
    expect(wrapper.emitted()).toEqual({});
  });

  it('renders header and actions slots', () => {
    const wrapper = mount(SectionList, {
      props: {
        title: 'Unused fallback',
      },
      slots: {
        header: '<div data-testid="custom-header">Custom header</div>',
        actions: '<button data-testid="section-action">Action</button>',
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="custom-header"]').text()).toBe('Custom header');
    expect(wrapper.get('[data-testid="section-action"]').text()).toBe('Action');
    expect(wrapper.text()).not.toContain('Unused fallback');
    expect(wrapper.emitted()).toEqual({});
  });
});
