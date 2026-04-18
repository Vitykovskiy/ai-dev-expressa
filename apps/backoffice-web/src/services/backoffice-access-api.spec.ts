import type {
  BackofficeAccessBootstrapResponse,
  BackofficeAccessContextResponse,
} from '@expressa/shared-types';
import { BackofficeAccessApi, normalizeBackofficeAccessError } from './backoffice-access-api';

describe('BackofficeAccessApi', () => {
  it('uses the bound global fetch implementation by default', async () => {
    const response: BackofficeAccessBootstrapResponse = {
      accessToken: 'token-default',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['barista'],
        blocked: false,
        isPrimaryAdministrator: false,
      },
    };
    const originalFetch = globalThis.fetch;
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    globalThis.fetch = fetchMock;

    try {
      const api = new BackofficeAccessApi('http://localhost:3000/api');

      const result = await api.bootstrapAccess({
        mode: 'telegram',
        telegramInitData: 'init-data',
      });

      expect(result).toEqual(response);
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/api/backoffice/access/bootstrap',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('sends bootstrap request to the backoffice access endpoint', async () => {
    const response: BackofficeAccessBootstrapResponse = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability', 'menu', 'users', 'settings'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: true,
      },
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const api = new BackofficeAccessApi('http://localhost:3000/api', fetchMock);

    const result = await api.bootstrapAccess({
      mode: 'telegram',
      telegramInitData: 'init-data',
    });

    expect(result).toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/backoffice/access/bootstrap',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          mode: 'telegram',
          telegramInitData: 'init-data',
        }),
      }),
    );
  });

  it('restores the current access context with a bearer token', async () => {
    const response: BackofficeAccessContextResponse = {
      accessToken: 'token-1',
      channel: 'backoffice-telegram-entry',
      isTestMode: false,
      availableTabs: ['orders', 'availability'],
      user: {
        userId: 'user-1',
        telegramId: '500001',
        roles: ['barista'],
        blocked: false,
        isPrimaryAdministrator: false,
      },
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const api = new BackofficeAccessApi('http://localhost:3000/api', fetchMock);

    const result = await api.getCurrentAccess('token-1');

    expect(result).toEqual(response);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/backoffice/access/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
        }),
      }),
    );
  });

  it('normalizes denied responses from the server contract', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 403,
          reason: 'backoffice-role-required',
          message: 'Backoffice role is required',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    const api = new BackofficeAccessApi('http://localhost:3000/api', fetchMock);

    await expect(api.bootstrapAccess({ mode: 'telegram' })).rejects.toEqual({
      statusCode: 403,
      reason: 'backoffice-role-required',
      message: 'Backoffice role is required',
    });

    expect(
      normalizeBackofficeAccessError({
        statusCode: 403,
        reason: 'backoffice-role-required',
        message: 'Backoffice role is required',
      }),
    ).toEqual({
      statusCode: 403,
      reason: 'backoffice-role-required',
      message: 'Backoffice role is required',
    });
  });

  it('supports a relative /api base URL without duplicating the prefix', async () => {
    const response: BackofficeAccessBootstrapResponse = {
      accessToken: 'token-relative',
      channel: 'test-mode-without-telegram',
      isTestMode: true,
      availableTabs: ['orders', 'menu'],
      user: {
        userId: 'user-2',
        telegramId: '500002',
        roles: ['administrator'],
        blocked: false,
        isPrimaryAdministrator: false,
      },
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    const api = new BackofficeAccessApi('/api', fetchMock);

    await api.bootstrapAccess({
      mode: 'test',
      testTelegramId: '500002',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backoffice/access/bootstrap',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
