import type { FoundationHealthResponse } from '@expressa/shared-types';
import { computed, ref } from 'vue';

import {
  foundationHealthApi,
  type FoundationHealthApi,
} from '@/shared/api/foundationRuntime';

type FoundationHealthStatus = 'idle' | 'loading' | 'success' | 'error';

const status = ref<FoundationHealthStatus>('idle');
const response = ref<FoundationHealthResponse | null>(null);
const errorMessage = ref<string | null>(null);

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return 'Unexpected foundation health error';
}

export function useFoundationHealth() {
  const isLoading = computed(() => status.value === 'loading');

  async function load(api: FoundationHealthApi = foundationHealthApi): Promise<void> {
    status.value = 'loading';
    errorMessage.value = null;

    try {
      response.value = await api.getHealth();
      status.value = 'success';
    } catch (error: unknown) {
      response.value = null;
      errorMessage.value = toErrorMessage(error);
      status.value = 'error';
    }
  }

  return {
    errorMessage,
    isLoading,
    load,
    response,
    status,
  };
}
