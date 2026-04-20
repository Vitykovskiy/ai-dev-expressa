import { reactive, readonly } from "vue";
import { bootstrapSession, SessionApiError } from "@/modules/auth/session-api";
import {
  prepareTelegramWebApp,
  getTelegramInitData,
} from "@/modules/auth/telegram";
import type { AuthenticatedActor, SessionState } from "@/modules/auth/types";

const state = reactive<SessionState>({
  status: "idle",
  actor: null,
  errorCode: null,
});

let pendingBootstrap: Promise<AuthenticatedActor> | null = null;

export function useAuthSession() {
  return {
    state: readonly(state),
    ensureSession,
    resetSession,
  };
}

export async function ensureSession(): Promise<AuthenticatedActor> {
  if (state.actor) {
    return state.actor;
  }

  if (pendingBootstrap) {
    return pendingBootstrap;
  }

  state.status = "loading";
  state.errorCode = null;
  prepareTelegramWebApp();

  pendingBootstrap = bootstrapSession(
    {
      initData: getTelegramInitData(),
      testTelegramId:
        import.meta.env.VITE_BACKOFFICE_TEST_TELEGRAM_ID?.trim() || undefined,
    },
    {
      apiBaseUrl: import.meta.env.VITE_BACKOFFICE_API_BASE_URL,
    },
  )
    .then((actor) => {
      state.actor = actor;
      state.status = "authenticated";
      state.errorCode = null;
      return actor;
    })
    .catch((error: unknown) => {
      state.actor = null;
      state.status = "denied";
      state.errorCode =
        error instanceof SessionApiError
          ? error.code
          : "backoffice-auth-failed";
      throw error;
    })
    .finally(() => {
      pendingBootstrap = null;
    });

  return pendingBootstrap;
}

export function resetSession(): void {
  state.status = "idle";
  state.actor = null;
  state.errorCode = null;
  pendingBootstrap = null;
}
