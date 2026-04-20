import { isRecord } from "@/modules/shared/type-guards";

export interface ErrorResponseBody {
  readonly message?: string;
}

export function resolveApiUrl(
  apiBaseUrl: string | undefined,
  path: string,
): string {
  const base = apiBaseUrl?.trim();
  return `${base ? base.replace(/\/$/, "") : ""}${path}`;
}

export function isErrorResponseBody(
  value: unknown,
): value is ErrorResponseBody {
  return isRecord(value) && "message" in value;
}

export async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
