import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAuthSessionStore } from '@/features/auth-session/composables/authSessionStore';
import type { AuthSessionApi } from '@/shared/api/authSession';
import type { TelegramWebAppSource } from '@/shared/telegram/webApp';

describe('authSession store', () => {
  let telegramSource: TelegramWebAppSource;

  beforeEach(() => {
    telegramSource = {
      getInitData: vi.fn().mockReturnValue('query_id=demo'),
      prepare: vi.fn(),
    };
  });

  it('stores an authenticated administrator session from Telegram WebApp init data', async () => {
    const api: AuthSessionApi = {
      bootstrapSession: vi.fn().mockResolvedValue({
        kind: 'authenticated',
        session: {
          accessChannel: 'backoffice-telegram-entry',
          displayName: 'Main Administrator',
          roles: ['administrator'],
          telegramId: '1001',
          userId: 'user-1',
        },
      }),
    };

    const store = createAuthSessionStore({ api, telegramSource });

    await store.bootstrap();

    expect(telegramSource.prepare).toHaveBeenCalledOnce();
    expect(api.bootstrapSession).toHaveBeenCalledWith({
      initData: 'query_id=demo',
      mode: 'telegram-webapp',
    });
    expect(store.status.value).toBe('authenticated');
    expect(store.session.value).toEqual({
      accessChannel: 'backoffice-telegram-entry',
      displayName: 'Main Administrator',
      roles: ['administrator'],
      telegramId: '1001',
      userId: 'user-1',
    });
    expect(store.errorMessage.value).toBeNull();
  });

  it('falls back to test mode and stores insufficient role denial', async () => {
    telegramSource = {
      getInitData: vi.fn().mockReturnValue(null),
      prepare: vi.fn(),
    };

    const api: AuthSessionApi = {
      bootstrapSession: vi.fn().mockResolvedValue({
        code: 'administrator-role-required',
        kind: 'denied',
        user: {
          displayName: 'Barista User',
          roles: ['barista'],
          telegramId: '2002',
        },
      }),
    };

    const store = createAuthSessionStore({ api, telegramSource });

    await store.bootstrap();

    expect(api.bootstrapSession).toHaveBeenCalledWith({
      mode: 'test-mode',
    });
    expect(store.lastRequest.value).toEqual({
      mode: 'test-mode',
    });
    expect(store.status.value).toBe('denied');
    expect(store.session.value).toBeNull();
    expect(store.response.value).toEqual({
      code: 'administrator-role-required',
      kind: 'denied',
      user: {
        displayName: 'Barista User',
        roles: ['barista'],
        telegramId: '2002',
      },
    });
  });

  it('keeps blocked users outside the shell', async () => {
    const api: AuthSessionApi = {
      bootstrapSession: vi.fn().mockResolvedValue({
        code: 'blocked-user',
        kind: 'blocked',
        user: {
          displayName: 'Blocked User',
          roles: ['administrator'],
          telegramId: '3003',
        },
      }),
    };

    const store = createAuthSessionStore({ api, telegramSource });

    await store.bootstrap();

    expect(store.status.value).toBe('blocked');
    expect(store.session.value).toBeNull();
    expect(store.response.value?.kind).toBe('blocked');
  });

  it('captures runtime errors without leaking stale session data', async () => {
    const api: AuthSessionApi = {
      bootstrapSession: vi.fn().mockRejectedValue(new Error('Auth backend is unavailable')),
    };

    const store = createAuthSessionStore({ api, telegramSource });

    await expect(store.bootstrap()).rejects.toThrow('Auth backend is unavailable');
    expect(store.status.value).toBe('error');
    expect(store.session.value).toBeNull();
    expect(store.response.value).toBeNull();
    expect(store.errorMessage.value).toBe('Auth backend is unavailable');
  });
});
