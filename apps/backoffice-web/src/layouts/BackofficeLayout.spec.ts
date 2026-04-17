import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import BackofficeLayout from './BackofficeLayout.vue';
import { router } from '../router';
import { vuetify } from '../vuetify';

describe('BackofficeLayout', () => {
  it('renders navigation and the current placeholder screen', async () => {
    await router.push('/users');
    await router.isReady();

    const wrapper = mount(BackofficeLayout, {
      global: {
        plugins: [router, vuetify],
      },
    });

    await nextTick();

    expect(wrapper.text()).toContain('Пользователи');
    expect(wrapper.text()).toContain('Каркас FEATURE-001 уже запущен');
    expect(wrapper.text()).toContain('Следующий шаг');
  });
});
