import type { AuthenticatedActor, SessionPayload } from "./types";

export interface SessionApiOptions {
  readonly apiBaseUrl?: string;
  readonly fetchImpl?: typeof fetch;
}

export class SessionApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string
  ) {
    super(message);
    this.name = "SessionApiError";
  }
}

export async function bootstrapSession(
  payload: SessionPayload,
  options: SessionApiOptions = {}
): Promise<AuthenticatedActor> {
  const response = await (options.fetchImpl ?? fetch)(resolveUrl(options.apiBaseUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await readJson(response);
  if (!response.ok) {
    const code = typeof body?.message === "string" ? body.message : "backoffice-auth-failed";
    throw new SessionApiError(code, response.status, code);
  }

  return body as AuthenticatedActor;
}

function resolveUrl(apiBaseUrl?: string): string {
  const base = apiBaseUrl?.trim();
  return `${base ? base.replace(/\/$/, "") : ""}/backoffice/auth/session`;
}

async function readJson(response: Response): Promise<unknown> {
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
