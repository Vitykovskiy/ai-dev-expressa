import { ref } from 'vue';
import { describe, expect, it } from 'vitest';

import {
  useAuthSessionViewModel,
} from '@/features/auth-session/composables/authSessionViewModel';
import type {
  AuthSessionStatus,
  AuthSessionStore,
} from '@/features/auth-session/composables/authSessionStore';

function createStoreMock(
  status: AuthSessionStatus,
  response: AuthSessionStore['response']['value'],
): AuthSessionStore {
  return {
    bootstrap: async () => {
      throw new Error('bootstrap is not used in view model tests');
    },
    errorMessage: ref(null),
    isBootstrapping: ref(status === 'bootstrapping'),
    lastRequest: ref({
      mode: 'test-mode',
    }),
    reset() {
      // no-op for tests
    },
    response: ref(response),
    session: ref(response?.kind === 'authenticated' ? response.session : null),
    status: ref(status),
  };
}

describe('authSession view model', () => {
  it('describes the insufficient role branch for access denied UI', () => {
    const store = createStoreMock('denied', {
      code: 'administrator-role-required',
      kind: 'denied',
      user: {
        displayName: 'Barista User',
        roles: ['barista'],
        telegramId: '2002',
      },
    });

    const viewModel = useAuthSessionViewModel(store);

    expect(viewModel.alert.value.title).toBe('Доступ отклонен по роли');
    expect(viewModel.alert.value.type).toBe('warning');
    expect(viewModel.userSnapshot.value).toEqual({
      displayName: 'Barista User',
      roles: ['barista'],
      telegramId: '2002',
    });
  });

  it('describes the blocked branch for blocked-state UI', () => {
    const store = createStoreMock('blocked', {
      code: 'blocked-user',
      kind: 'blocked',
      user: {
        displayName: 'Blocked Administrator',
        roles: ['administrator'],
        telegramId: '3003',
      },
    });

    const viewModel = useAuthSessionViewModel(store);

    expect(viewModel.alert.value.title).toBe('Пользователь заблокирован');
    expect(viewModel.alert.value.type).toBe('error');
    expect(viewModel.userSnapshot.value).toEqual({
      displayName: 'Blocked Administrator',
      roles: ['administrator'],
      telegramId: '3003',
    });
  });
});
