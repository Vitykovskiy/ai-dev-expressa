import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFoundationHealth } from '@/features/foundation-runtime/composables/foundationHealth';
import type { FoundationHealthApi } from '@/shared/api/foundationRuntime';

describe('foundationHealth composable', () => {
  beforeEach(() => {
    const health = useFoundationHealth();

    health.status.value = 'idle';
    health.response.value = null;
    health.errorMessage.value = null;
  });

  it('stores the backend response after a successful health check', async () => {
    const api: FoundationHealthApi = {
      getHealth: vi.fn().mockResolvedValue({
        status: 'ok',
        service: 'api',
      }),
    };

    const health = useFoundationHealth();

    await health.load(api);

    expect(health.status.value).toBe('success');
    expect(health.response.value).toEqual({
      status: 'ok',
      service: 'api',
    });
    expect(health.errorMessage.value).toBeNull();
  });

  it('captures the error branch without leaving stale response data', async () => {
    const api: FoundationHealthApi = {
      getHealth: vi.fn().mockRejectedValue(new Error('Backend is unavailable')),
    };

    const health = useFoundationHealth();

    await health.load(api);

    expect(health.status.value).toBe('error');
    expect(health.response.value).toBeNull();
    expect(health.errorMessage.value).toBe('Backend is unavailable');
  });
});
