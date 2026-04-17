import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import BackofficeLayout from './BackofficeLayout.vue';
import { router } from '../router';
import {
  backofficeAccessStore,
  resetBackofficeAccessStoreForTesting,
} from '../stores/backoffice-access-store';
import { vuetify } from '../vuetify';

describe('BackofficeLayout', () => {
  beforeEach(() => {
    resetBackofficeAccessStoreForTesting();
    backofficeAccessStore.state.status = 'ready';
    backofficeAccessStore.state.context = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability', 'menu', 'users', 'settings'],
      user: {
        userId: 'user-1',
        telegramId: '900001',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: true,
      },
    };
    backofficeAccessStore.state.accessToken = 'token-1';
  });

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
    expect(wrapper.text()).toContain('Контекст 900001 синхронизирован');
    expect(wrapper.text()).toContain('Навигационный каркас строится по серверному');
  });
});
