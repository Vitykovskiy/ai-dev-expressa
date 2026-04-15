export interface FoundationHealthResponse {
  status: 'ok';
  service: 'api';
}

export function isFoundationHealthResponse(
  value: unknown,
): value is FoundationHealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<FoundationHealthResponse>;

  return candidate.status === 'ok' && candidate.service === 'api';
}
