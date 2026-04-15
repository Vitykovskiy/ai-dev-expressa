import { describe, expect, it, vi } from 'vitest';

import {
  buildFoundationHealthUrl,
  fetchFoundationHealth,
} from '@/shared/api/foundationRuntime';

describe('foundationRuntime api adapter', () => {
  it('builds the foundation health url from the configured base url', () => {
    expect(buildFoundationHealthUrl('http://localhost:3000')).toBe(
      'http://localhost:3000/api/foundation/health',
    );
  });

  it('returns a typed foundation health response', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', service: 'api' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    await expect(
      fetchFoundationHealth({
        baseUrl: 'http://localhost:3000',
        fetchImpl,
      }),
    ).resolves.toEqual({
      status: 'ok',
      service: 'api',
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:3000/api/foundation/health',
      {
        headers: {
          accept: 'application/json',
        },
      },
    );
  });

  it('rejects when backend returns a payload outside the shared contract', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ status: 'broken', service: 'api' }), {
        status: 200,
      }),
    );

    await expect(
      fetchFoundationHealth({
        baseUrl: 'http://localhost:3000',
        fetchImpl,
      }),
    ).rejects.toThrow('Foundation health response has invalid shape');
  });
});
