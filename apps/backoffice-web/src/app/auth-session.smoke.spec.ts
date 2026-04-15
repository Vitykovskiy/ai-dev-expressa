import { createMemoryHistory } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';

import { createAppRouter } from '@/app/router';
import {
  createAuthSessionStore,
} from '@/features/auth-session/composables/authSessionStore';
import type { AuthSessionApi } from '@/shared/api/authSession';
import type { TelegramWebAppSource } from '@/shared/telegram/webApp';

describe('auth/session smoke', () => {
  it('opens the minimal backoffice shell after a test-mode bootstrap', async () => {
    const telegramSource: TelegramWebAppSource = {
      getInitData: vi.fn().mockReturnValue(null),
      prepare: vi.fn(),
    };
    const api: AuthSessionApi = {
      bootstrapSession: vi.fn().mockResolvedValue({
        kind: 'authenticated',
        session: {
          accessChannel: 'test-mode-without-telegram',
          displayName: 'Main Administrator',
          roles: ['administrator'],
          telegramId: '1001',
          userId: 'user-1',
        },
      }),
    };
    const store = createAuthSessionStore({ api, telegramSource });
    const router = createAppRouter({
      api,
      history: createMemoryHistory(),
      store,
      telegramSource,
    });

    await router.push('/backoffice');

    expect(router.currentRoute.value.name).toBe('backoffice-shell');
    expect(store.status.value).toBe('authenticated');
    expect(store.session.value?.accessChannel).toBe('test-mode-without-telegram');
  });

  it('redirects blocked users back to the auth entry instead of opening the shell', async () => {
    const telegramSource: TelegramWebAppSource = {
      getInitData: vi.fn().mockReturnValue('query_id=demo'),
      prepare: vi.fn(),
    };
    const api: AuthSessionApi = {
      bootstrapSession: vi.fn().mockResolvedValue({
        code: 'blocked-user',
        kind: 'blocked',
        user: {
          displayName: 'Blocked Administrator',
          roles: ['administrator'],
          telegramId: '3003',
        },
      }),
    };
    const store = createAuthSessionStore({ api, telegramSource });
    const router = createAppRouter({
      api,
      history: createMemoryHistory(),
      store,
      telegramSource,
    });

    await router.push('/backoffice');

    expect(router.currentRoute.value.name).toBe('auth-session-entry');
    expect(store.status.value).toBe('blocked');
  });
});
