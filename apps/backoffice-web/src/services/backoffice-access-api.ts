import type {
  BackofficeAccessBootstrapRequest,
  BackofficeAccessBootstrapResponse,
  BackofficeAccessContextResponse,
  BackofficeAccessDeniedResponse,
} from '@expressa/shared-types';
import type { BackofficeAccessError } from '../types';

type FetchLike = typeof fetch;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDeniedResponse(value: unknown): value is BackofficeAccessDeniedResponse {
  return (
    isRecord(value) &&
    typeof value.statusCode === 'number' &&
    typeof value.reason === 'string' &&
    typeof value.message === 'string'
  );
}

function isAccessErrorLike(value: unknown): value is BackofficeAccessError {
  return (
    isRecord(value) &&
    typeof value.statusCode === 'number' &&
    typeof value.reason === 'string' &&
    typeof value.message === 'string'
  );
}

async function readJson(response: Response): Promise<unknown> {
  const payload = await response.text();

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
}

function createUnexpectedResponseError(statusCode: number, message: string): BackofficeAccessError {
  return {
    statusCode,
    reason: 'unexpected-response',
    message,
  };
}

export function normalizeBackofficeAccessError(error: unknown): BackofficeAccessError {
  if (isAccessErrorLike(error)) {
    return {
      statusCode: error.statusCode,
      reason: error.reason,
      message: error.message,
    };
  }

  if (error instanceof TypeError) {
    return {
      statusCode: 0,
      reason: 'network-error',
      message: error.message || 'Network request failed',
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 0,
      reason: 'unexpected-response',
      message: error.message || 'Unexpected client error',
    };
  }

  return createUnexpectedResponseError(0, 'Unexpected client error');
}

export class BackofficeAccessApi {
  constructor(
    private readonly apiBaseUrl: string,
    private readonly fetchImpl: FetchLike = fetch.bind(globalThis),
  ) {}

  bootstrapAccess(
    request: BackofficeAccessBootstrapRequest,
  ): Promise<BackofficeAccessBootstrapResponse> {
    return this.request<BackofficeAccessBootstrapResponse>('/backoffice/access/bootstrap', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  getCurrentAccess(accessToken: string): Promise<BackofficeAccessContextResponse> {
    return this.request<BackofficeAccessContextResponse>('/backoffice/access/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.fetchImpl(`${this.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
    const payload = await readJson(response);

    if (!response.ok) {
      if (isDeniedResponse(payload)) {
        throw payload;
      }

      throw createUnexpectedResponseError(response.status, `Unexpected response for ${path}`);
    }

    if (!isRecord(payload)) {
      throw createUnexpectedResponseError(response.status, `Response payload for ${path} is empty`);
    }

    return payload as T;
  }
}
