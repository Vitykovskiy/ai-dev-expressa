import type { AuthSessionDeniedCode, AuthSessionUserSnapshot } from '@expressa/shared-types';
import { computed } from 'vue';

import type { AuthSessionStore } from '@/features/auth-session/composables/authSessionStore';

interface AuthSessionAlertState {
  message: string;
  title: string;
  type: 'error' | 'info' | 'success' | 'warning';
}

function toDeniedMessage(code: AuthSessionDeniedCode): AuthSessionAlertState {
  switch (code) {
    case 'administrator-role-required':
      return {
        message:
          'Сервер подтвердил вход, но у пользователя нет роли administrator для административного shell.',
        title: 'Доступ отклонен по роли',
        type: 'warning',
      };
    case 'telegram-entry-required':
      return {
        message:
          'Рабочий вход разрешен только через Telegram backoffice WebApp. Test mode сервером не разрешен.',
        title: 'Нужен Telegram entry',
        type: 'warning',
      };
    case 'test-mode-disabled':
      return {
        message:
          'Telegram init data не обнаружены, а backend не включил test mode через DISABLE_TG_AUTH=true.',
        title: 'Test mode отключен',
        type: 'warning',
      };
  }
}

function extractUserSnapshot(store: AuthSessionStore): AuthSessionUserSnapshot | null {
  const response = store.response.value;

  if (response === null) {
    return null;
  }

  switch (response.kind) {
    case 'authenticated':
      return response.session;
    case 'blocked':
      return response.user;
    case 'denied':
      return response.user;
  }
}

export function useAuthSessionViewModel(store: AuthSessionStore) {
  const alert = computed<AuthSessionAlertState>(() => {
    switch (store.status.value) {
      case 'idle':
        return {
          message:
            'Ожидаем Telegram WebApp init data. Если их нет, frontend попробует тот же backend auth/session контракт в test mode.',
          title: 'Готов к bootstrap',
          type: 'info',
        };
      case 'bootstrapping':
        return {
          message:
            'Frontend запрашивает auth/session bootstrap и ждет server-side решение по administrator guard.',
          title: 'Проверяем административную сессию',
          type: 'info',
        };
      case 'authenticated':
        return {
          message:
            'Сервер вернул административную сессию. Можно открыть минимальный backoffice shell без последующих capability.',
          title: 'Вход подтвержден',
          type: 'success',
        };
      case 'denied':
        return toDeniedMessage(store.response.value?.kind === 'denied'
          ? store.response.value.code
          : 'administrator-role-required');
      case 'blocked':
        return {
          message:
            'Пользователь присутствует в системе, но помечен как blocked и не может открыть backoffice.',
          title: 'Пользователь заблокирован',
          type: 'error',
        };
      case 'error':
        return {
          message:
            store.errorMessage.value
            ?? 'Frontend не смог завершить auth/session bootstrap из-за runtime ошибки.',
          title: 'Bootstrap завершился ошибкой',
          type: 'error',
        };
    }
  });

  const entryHint = computed(() => {
    switch (store.lastRequest.value?.mode) {
      case 'telegram-webapp':
        return 'Источник входа: Telegram WebApp init data переданы в backend.';
      case 'test-mode':
        return 'Источник входа: Telegram init data отсутствуют, запрошен backend test mode fallback.';
      default:
        return 'Источник входа определится автоматически по наличию Telegram WebApp init data.';
    }
  });

  const actionLabel = computed(() => (
    store.status.value === 'bootstrapping' ? 'Проверяем вход' : 'Повторить вход'
  ));

  const userSnapshot = computed(() => extractUserSnapshot(store));

  return {
    actionLabel,
    alert,
    entryHint,
    userSnapshot,
  };
}
