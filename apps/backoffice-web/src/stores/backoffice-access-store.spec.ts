import type {
  BackofficeAccessBootstrapRequest,
  BackofficeAccessContextResponse,
} from '@expressa/shared-types';
import { createBackofficeAccessStore } from './backoffice-access-store';

function createContext(
  overrides: Partial<BackofficeAccessContextResponse> = {},
): BackofficeAccessContextResponse {
  return {
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
    ...overrides,
  };
}

describe('createBackofficeAccessStore', () => {
  it('restores an existing session before running bootstrap', async () => {
    const accessTokenStorage = {
      clear: vi.fn(),
      read: vi.fn().mockReturnValue('stored-token'),
      write: vi.fn(),
    };
    const accessApi = {
      bootstrapAccess: vi.fn<() => Promise<BackofficeAccessContextResponse>>(),
      getCurrentAccess: vi.fn().mockResolvedValue(createContext({ accessToken: 'stored-token' })),
    };
    const store = createBackofficeAccessStore({
      accessApi,
      accessTokenStorage,
    });

    await store.initialize();

    expect(accessApi.getCurrentAccess).toHaveBeenCalledWith('stored-token');
    expect(accessApi.bootstrapAccess).not.toHaveBeenCalled();
    expect(store.state.status).toBe('ready');
    expect(store.state.context?.accessToken).toBe('stored-token');
  });

  it('falls back to bootstrap when the saved token is no longer valid', async () => {
    const accessTokenStorage = {
      clear: vi.fn(),
      read: vi.fn().mockReturnValue('expired-token'),
      write: vi.fn(),
    };
    const accessApi = {
      bootstrapAccess: vi.fn().mockResolvedValue(createContext({ accessToken: 'fresh-token' })),
      getCurrentAccess: vi.fn().mockRejectedValue({
        statusCode: 401,
        reason: 'access-token-invalid',
        message: 'Access token is invalid',
      }),
    };
    const bootstrapRequestFactory = vi
      .fn<() => BackofficeAccessBootstrapRequest>()
      .mockReturnValue({
        mode: 'telegram',
        telegramInitData: 'init-data',
      });
    const store = createBackofficeAccessStore({
      accessApi,
      accessTokenStorage,
      bootstrapRequestFactory,
    });

    await store.initialize();

    expect(accessTokenStorage.clear).toHaveBeenCalledTimes(1);
    expect(accessApi.bootstrapAccess).toHaveBeenCalledWith({
      mode: 'telegram',
      telegramInitData: 'init-data',
    });
    expect(accessTokenStorage.write).toHaveBeenCalledWith('fresh-token');
    expect(store.state.status).toBe('ready');
    expect(store.state.context?.accessToken).toBe('fresh-token');
  });

  it('stores bootstrap errors when access initialization fails', async () => {
    const accessTokenStorage = {
      clear: vi.fn(),
      read: vi.fn().mockReturnValue(null),
      write: vi.fn(),
    };
    const accessApi = {
      bootstrapAccess: vi.fn().mockRejectedValue({
        statusCode: 401,
        reason: 'telegram-context-required',
        message: 'Telegram context is required',
      }),
      getCurrentAccess: vi.fn<() => Promise<BackofficeAccessContextResponse>>(),
    };
    const store = createBackofficeAccessStore({
      accessApi,
      accessTokenStorage,
      bootstrapRequestFactory: vi.fn<() => BackofficeAccessBootstrapRequest>().mockReturnValue({
        mode: 'telegram',
        telegramInitData: 'signed-init-data',
      }),
    });

    await store.initialize();

    expect(store.state.status).toBe('error');
    expect(store.state.error).toEqual({
      statusCode: 401,
      reason: 'telegram-context-required',
      message: 'Telegram context is required',
    });
  });

  it('stores pre-bootstrap access denial when Telegram context is absent before the request', async () => {
    const accessTokenStorage = {
      clear: vi.fn(),
      read: vi.fn().mockReturnValue(null),
      write: vi.fn(),
    };
    const accessApi = {
      bootstrapAccess: vi.fn<() => Promise<BackofficeAccessContextResponse>>(),
      getCurrentAccess: vi.fn<() => Promise<BackofficeAccessContextResponse>>(),
    };
    const bootstrapRequestFactory = vi.fn<() => BackofficeAccessBootstrapRequest>().mockImplementation(() => {
      throw {
        statusCode: 401,
        reason: 'telegram-context-required',
        message: 'Telegram-контекст обязателен',
      };
    });
    const store = createBackofficeAccessStore({
      accessApi,
      accessTokenStorage,
      bootstrapRequestFactory,
    });

    await store.initialize();

    expect(accessApi.bootstrapAccess).not.toHaveBeenCalled();
    expect(store.state.status).toBe('error');
    expect(store.state.error).toEqual({
      statusCode: 401,
      reason: 'telegram-context-required',
      message: 'Telegram-контекст обязателен',
    });
  });
});
