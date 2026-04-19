import { Request } from "express";

export interface BackofficeAuthInput {
  readonly initData?: string;
  readonly testTelegramId?: string;
}

export function getBackofficeAuthInputFromRequest(
  request: Request,
): BackofficeAuthInput {
  return {
    initData: getHeader(request, "x-telegram-init-data"),
    testTelegramId: getHeader(request, "x-test-telegram-id"),
  };
}

function getHeader(request: Request, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}
