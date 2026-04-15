import { describe, expect, it, vi } from 'vitest';

import {
  buildAuthSessionUrl,
  fetchAuthSession,
} from '@/shared/api/authSession';

describe('authSession api adapter', () => {
  it('builds the auth/session url from the configured base url', () => {
    expect(buildAuthSessionUrl('http://localhost:3100')).toBe(
      'http://localhost:3100/api/auth/session',
    );
  });

  it('posts a typed bootstrap request and accepts a denied response branch', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'administrator-role-required',
          kind: 'denied',
          user: {
            displayName: 'Barista User',
            roles: ['barista'],
            telegramId: '2002',
          },
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    await expect(
      fetchAuthSession({
        baseUrl: 'http://localhost:3100',
        fetchImpl,
        request: {
          mode: 'test-mode',
        },
      }),
    ).resolves.toEqual({
      code: 'administrator-role-required',
      kind: 'denied',
      user: {
        displayName: 'Barista User',
        roles: ['barista'],
        telegramId: '2002',
      },
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:3100/api/auth/session',
      {
        body: JSON.stringify({
          mode: 'test-mode',
        }),
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        method: 'POST',
      },
    );
  });

  it('rejects when backend returns a payload outside the shared contract', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          kind: 'authenticated',
          session: {
            accessChannel: 'backoffice-telegram-entry',
            displayName: 'Admin',
            roles: ['barista'],
            telegramId: '1001',
            userId: 'user-1',
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    await expect(
      fetchAuthSession({
        baseUrl: 'http://localhost:3100',
        fetchImpl,
        request: {
          initData: 'query_id=demo',
          mode: 'telegram-webapp',
        },
      }),
    ).rejects.toThrow('Auth session response has invalid shape');
  });
});
