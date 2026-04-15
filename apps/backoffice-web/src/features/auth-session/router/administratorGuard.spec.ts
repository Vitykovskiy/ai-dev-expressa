import { describe, expect, it, vi } from 'vitest';

import {
  createAuthSessionStore,
} from '@/features/auth-session/composables/authSessionStore';
import { createAdministratorGuard } from '@/features/auth-session/router/administratorGuard';
import type { AuthSessionApi } from '@/shared/api/authSession';
import type { TelegramWebAppSource } from '@/shared/telegram/webApp';

describe('administrator guard', () => {
  const telegramSource: TelegramWebAppSource = {
    getInitData: vi.fn().mockReturnValue('query_id=demo'),
    prepare: vi.fn(),
  };

  it('allows navigation when the target route does not require administrator access', async () => {
    const api: AuthSessionApi = {
      bootstrapSession: vi.fn(),
    };
    const store = createAuthSessionStore({ api, telegramSource });
    const guard = createAdministratorGuard(store, { api, telegramSource });

    const result = await guard({
      matched: [{ meta: {} }],
    } as never);

    expect(result).toBe(true);
    expect(api.bootstrapSession).not.toHaveBeenCalled();
  });

  it('allows administrator shell when bootstrap succeeds', async () => {
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
    const guard = createAdministratorGuard(store, { api, telegramSource });

    const result = await guard({
      matched: [{ meta: { requiresAdministrator: true } }],
    } as never);

    expect(result).toBe(true);
    expect(store.status.value).toBe('authenticated');
  });

  it('redirects to the auth entry when administrator access is denied', async () => {
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
    const guard = createAdministratorGuard(store, { api, telegramSource });

    const result = await guard({
      matched: [{ meta: { requiresAdministrator: true } }],
    } as never);

    expect(result).toEqual({ name: 'auth-session-entry' });
    expect(store.status.value).toBe('denied');
  });
});
