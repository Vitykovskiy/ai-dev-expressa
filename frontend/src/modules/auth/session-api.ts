import {
  isErrorResponseBody,
  readJson,
  resolveApiUrl,
} from "@/modules/shared/http";
import type { AuthenticatedActor, SessionPayload } from "@/modules/auth/types";

export interface SessionApiOptions {
  readonly apiBaseUrl?: string;
  readonly fetchImpl?: typeof fetch;
}

export class SessionApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "SessionApiError";
  }
}

export async function bootstrapSession(
  payload: SessionPayload,
  options: SessionApiOptions = {},
): Promise<AuthenticatedActor> {
  const response = await (options.fetchImpl ?? fetch)(
    resolveApiUrl(options.apiBaseUrl, "/backoffice/auth/session"),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const body = await readJson(response);
  if (!response.ok) {
    const code =
      isErrorResponseBody(body) && typeof body.message === "string"
        ? body.message
        : "backoffice-auth-failed";
    throw new SessionApiError(code, response.status, code);
  }

  return body as AuthenticatedActor;
}
