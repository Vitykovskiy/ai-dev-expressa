import type {
  BackofficeAccessBootstrapRequest,
  BackofficeAccessContextResponse,
} from '@expressa/shared-types';
import { reactive } from 'vue';
import { appEnvironment } from '../services/app-environment';
import {
  BackofficeAccessApi,
  normalizeBackofficeAccessError,
} from '../services/backoffice-access-api';
import {
  createBackofficeAccessTokenStorage,
  type BackofficeAccessTokenStorage,
} from '../services/access-token-storage';
import { readBackofficeBootstrapRequest } from '../services/telegram-webapp';
import type { BackofficeAccessError, BackofficeAccessState } from '../types';

interface BackofficeAccessApiPort {
  bootstrapAccess(
    request: BackofficeAccessBootstrapRequest,
  ): Promise<BackofficeAccessContextResponse>;
  getCurrentAccess(accessToken: string): Promise<BackofficeAccessContextResponse>;
}

interface BackofficeAccessStoreDependencies {
  accessApi: BackofficeAccessApiPort;
  accessTokenStorage: BackofficeAccessTokenStorage;
  bootstrapRequestFactory?: () => BackofficeAccessBootstrapRequest;
}

export interface BackofficeAccessStore {
  clear(): void;
  initialize(): Promise<void>;
  retry(): Promise<void>;
  state: BackofficeAccessState;
}

function isRecoverableSessionError(error: BackofficeAccessError): boolean {
  return error.reason === 'access-token-invalid' || error.reason === 'access-token-required';
}

export function createBackofficeAccessStore({
  accessApi,
  accessTokenStorage,
  bootstrapRequestFactory = () => readBackofficeBootstrapRequest(appEnvironment),
}: BackofficeAccessStoreDependencies): BackofficeAccessStore {
  const state = reactive<BackofficeAccessState>({
    status: 'idle',
    accessToken: null,
    context: null,
    error: null,
  });
  let pendingInitialization: Promise<void> | null = null;

  function commitContext(context: BackofficeAccessContextResponse) {
    accessTokenStorage.write(context.accessToken);
    state.status = 'ready';
    state.accessToken = context.accessToken;
    state.context = context;
    state.error = null;
  }

  function clear() {
    accessTokenStorage.clear();
    state.status = 'idle';
    state.accessToken = null;
    state.context = null;
    state.error = null;
  }

  async function bootstrap() {
    state.status = 'bootstrapping';

    try {
      const context = await accessApi.bootstrapAccess(bootstrapRequestFactory());
      commitContext(context);
    } catch (error) {
      clear();
      state.status = 'error';
      state.error = normalizeBackofficeAccessError(error);
    }
  }

  async function runInitialize() {
    const existingAccessToken = accessTokenStorage.read();

    if (!existingAccessToken) {
      await bootstrap();
      return;
    }

    state.status = 'restoring';
    state.accessToken = existingAccessToken;
    state.context = null;
    state.error = null;

    try {
      const context = await accessApi.getCurrentAccess(existingAccessToken);
      commitContext(context);
    } catch (error) {
      const normalizedError = normalizeBackofficeAccessError(error);

      if (!isRecoverableSessionError(normalizedError)) {
        state.status = 'error';
        state.error = normalizedError;
        return;
      }

      accessTokenStorage.clear();
      state.accessToken = null;

      // Invalid or missing session should transparently fall back to a fresh bootstrap.
      await bootstrap();
    }
  }

  async function initialize() {
    if (pendingInitialization) {
      await pendingInitialization;
      return;
    }

    pendingInitialization = runInitialize().finally(() => {
      pendingInitialization = null;
    });
    await pendingInitialization;
  }

  async function retry() {
    await initialize();
  }

  return {
    clear,
    initialize,
    retry,
    state,
  };
}

export const backofficeAccessStore = createBackofficeAccessStore({
  accessApi: new BackofficeAccessApi(appEnvironment.apiBaseUrl),
  accessTokenStorage: createBackofficeAccessTokenStorage(),
});

export function resetBackofficeAccessStoreForTesting() {
  backofficeAccessStore.clear();
}
