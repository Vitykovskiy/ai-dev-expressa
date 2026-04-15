import {
  type AuthSessionBootstrapRequest,
  type AuthSessionBootstrapResponse,
  isAuthSessionBootstrapResponse,
  isAuthSessionBootstrapRequest,
} from '@expressa/shared-types';

import { getApiBaseUrl } from '@/shared/config/env';

const AUTH_SESSION_PATH = '/api/auth/session';

export interface FetchAuthSessionOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  request: AuthSessionBootstrapRequest;
}

export interface AuthSessionApi {
  bootstrapSession(
    request: AuthSessionBootstrapRequest,
  ): Promise<AuthSessionBootstrapResponse>;
}

export function buildAuthSessionUrl(baseUrl: string): string {
  return `${baseUrl}${AUTH_SESSION_PATH}`;
}

async function readResponsePayload(response: Response): Promise<unknown> {
  const rawPayload = await response.text();

  if (rawPayload.length === 0) {
    return null;
  }

  try {
    return JSON.parse(rawPayload) as unknown;
  } catch {
    throw new Error('Auth session response is not valid JSON');
  }
}

export async function fetchAuthSession(
  options: FetchAuthSessionOptions,
): Promise<AuthSessionBootstrapResponse> {
  if (!isAuthSessionBootstrapRequest(options.request)) {
    throw new Error('Auth session request has invalid shape');
  }

  const baseUrl = options.baseUrl ?? getApiBaseUrl();
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(buildAuthSessionUrl(baseUrl), {
    body: JSON.stringify(options.request),
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
  });
  const payload = await readResponsePayload(response);

  if (isAuthSessionBootstrapResponse(payload)) {
    return payload;
  }

  if (!response.ok) {
    throw new Error(`Auth session request failed with ${response.status}`);
  }

  throw new Error('Auth session response has invalid shape');
}

export const authSessionApi: AuthSessionApi = {
  bootstrapSession(request) {
    return fetchAuthSession({ request });
  },
};
