import type {
  AdministratorSession,
  AuthSessionBootstrapRequest,
  AuthSessionBootstrapResponse,
} from '@expressa/shared-types';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

import { authSessionApi, type AuthSessionApi } from '@/shared/api/authSession';
import {
  telegramWebAppSource,
  type TelegramWebAppSource,
} from '@/shared/telegram/webApp';

export type AuthSessionStatus =
  | 'idle'
  | 'bootstrapping'
  | 'authenticated'
  | 'denied'
  | 'blocked'
  | 'error';

export interface AuthSessionBootstrapDependencies {
  api?: AuthSessionApi;
  telegramSource?: TelegramWebAppSource;
}

export interface AuthSessionStore {
  bootstrap(
    overrides?: AuthSessionBootstrapDependencies,
  ): Promise<AuthSessionBootstrapResponse>;
  errorMessage: Ref<string | null>;
  isBootstrapping: Ref<boolean>;
  lastRequest: Ref<AuthSessionBootstrapRequest | null>;
  reset(): void;
  response: Ref<AuthSessionBootstrapResponse | null>;
  session: Ref<AdministratorSession | null>;
  status: Ref<AuthSessionStatus>;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return 'Unexpected auth/session error';
}

function createBootstrapRequest(
  telegramSource: TelegramWebAppSource,
): AuthSessionBootstrapRequest {
  const initData = telegramSource.getInitData();

  if (initData !== null) {
    return {
      initData,
      mode: 'telegram-webapp',
    };
  }

  return {
    mode: 'test-mode',
  };
}

function applyBootstrapResponse(
  response: AuthSessionBootstrapResponse,
  session: AuthSessionStore['session'],
  status: AuthSessionStore['status'],
): void {
  switch (response.kind) {
    case 'authenticated':
      session.value = response.session;
      status.value = 'authenticated';
      break;
    case 'blocked':
      session.value = null;
      status.value = 'blocked';
      break;
    case 'denied':
      session.value = null;
      status.value = 'denied';
      break;
  }
}

export function createAuthSessionStore(
  defaults: AuthSessionBootstrapDependencies = {},
): AuthSessionStore {
  const status = ref<AuthSessionStatus>('idle');
  const session = ref<AdministratorSession | null>(null);
  const response = ref<AuthSessionBootstrapResponse | null>(null);
  const errorMessage = ref<string | null>(null);
  const lastRequest = ref<AuthSessionBootstrapRequest | null>(null);
  const isBootstrapping = computed(() => status.value === 'bootstrapping');
  let pendingBootstrap: Promise<AuthSessionBootstrapResponse> | null = null;

  async function bootstrap(
    overrides: AuthSessionBootstrapDependencies = {},
  ): Promise<AuthSessionBootstrapResponse> {
    if (pendingBootstrap !== null) {
      return pendingBootstrap;
    }

    if (status.value === 'authenticated' && response.value?.kind === 'authenticated') {
      return response.value;
    }

    const api = overrides.api ?? defaults.api ?? authSessionApi;
    const telegramSource = overrides.telegramSource ?? defaults.telegramSource ?? telegramWebAppSource;

    telegramSource.prepare();

    const request = createBootstrapRequest(telegramSource);

    lastRequest.value = request;
    status.value = 'bootstrapping';
    errorMessage.value = null;

    pendingBootstrap = api
      .bootstrapSession(request)
      .then((nextResponse) => {
        response.value = nextResponse;
        applyBootstrapResponse(nextResponse, session, status);

        return nextResponse;
      })
      .catch((error: unknown) => {
        response.value = null;
        session.value = null;
        status.value = 'error';
        errorMessage.value = toErrorMessage(error);
        throw error;
      })
      .finally(() => {
        pendingBootstrap = null;
      });

    return pendingBootstrap;
  }

  function reset(): void {
    errorMessage.value = null;
    lastRequest.value = null;
    pendingBootstrap = null;
    response.value = null;
    session.value = null;
    status.value = 'idle';
  }

  return {
    bootstrap,
    errorMessage,
    isBootstrapping,
    lastRequest,
    reset,
    response,
    session,
    status,
  };
}

export const authSessionStore = createAuthSessionStore();

export function useAuthSessionStore(): AuthSessionStore {
  return authSessionStore;
}
