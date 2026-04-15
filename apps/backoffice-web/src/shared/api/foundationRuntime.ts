import {
  type FoundationHealthResponse,
  isFoundationHealthResponse,
} from '@expressa/shared-types';

import { getApiBaseUrl } from '@/shared/config/env';

const FOUNDATION_HEALTH_PATH = '/api/foundation/health';

export interface FetchFoundationHealthOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface FoundationHealthApi {
  getHealth(): Promise<FoundationHealthResponse>;
}

export function buildFoundationHealthUrl(baseUrl: string): string {
  return `${baseUrl}${FOUNDATION_HEALTH_PATH}`;
}

export async function fetchFoundationHealth(
  options: FetchFoundationHealthOptions = {},
): Promise<FoundationHealthResponse> {
  const baseUrl = options.baseUrl ?? getApiBaseUrl();
  const fetchImpl = options.fetchImpl ?? fetch;

  const response = await fetchImpl(buildFoundationHealthUrl(baseUrl), {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Foundation health request failed with ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isFoundationHealthResponse(payload)) {
    throw new Error('Foundation health response has invalid shape');
  }

  return payload;
}

export const foundationHealthApi: FoundationHealthApi = {
  getHealth() {
    return fetchFoundationHealth();
  },
};
