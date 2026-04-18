import { mount } from '@vue/test-utils';
import Skeleton from './Skeleton.vue';
import { vuetify } from '../../vuetify';

describe('Skeleton', () => {
  it('renders the default card variant', () => {
    const wrapper = mount(Skeleton, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.get('[data-testid="base-skeleton"]').classes()).toContain('base-skeleton--card');
    expect(wrapper.findAll('.base-skeleton__line')).toHaveLength(4);
    expect(wrapper.findAll('.base-skeleton__button')).toHaveLength(2);
  });

  it('renders list-row and text-block variants', () => {
    const rowWrapper = mount(Skeleton, {
      props: {
        variant: 'list-row',
        showAvatar: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const textWrapper = mount(Skeleton, {
      props: {
        variant: 'text-block',
        lines: 4,
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(rowWrapper.get('[data-testid="base-skeleton"]').classes()).toContain('base-skeleton--list-row');
    expect(rowWrapper.find('.base-skeleton__avatar').exists()).toBe(true);
    expect(textWrapper.get('[data-testid="base-skeleton"]').classes()).toContain('base-skeleton--text-block');
    expect(textWrapper.findAll('.base-skeleton__line')).toHaveLength(4);
  });
});
