import { describe, expect, it } from 'vitest';

import { useFoundationHealth } from '@/features/foundation-runtime/composables/foundationHealth';

describe('foundation runtime smoke', () => {
  const baseUrl = process.env.VITE_API_BASE_URL;

  it.runIf(typeof baseUrl === 'string' && baseUrl.length > 0)(
    'renders the live health response from the configured API',
    async () => {
    (import.meta.env as Record<string, string>).VITE_API_BASE_URL = baseUrl;
    const health = useFoundationHealth();

    await health.load();

    expect(health.status.value).toBe('success');
    expect(health.errorMessage.value).toBeNull();
    expect(health.response.value).toEqual({
      status: 'ok',
      service: 'api',
    });
    },
  );
});
