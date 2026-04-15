import { createHmac, timingSafeEqual } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';

import {
  API_RUNTIME_ENV,
  type ApiRuntimeEnv,
} from '../../shared/config/runtime-env';

export interface TelegramIdentity {
  displayName: string;
  telegramId: string;
}

interface TelegramInitDataUserPayload {
  first_name?: unknown;
  id?: unknown;
  last_name?: unknown;
  username?: unknown;
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function buildDisplayName(
  telegramId: string,
  payload: TelegramInitDataUserPayload,
): string {
  const firstName = normalizeText(payload.first_name);
  const lastName = normalizeText(payload.last_name);
  const fullName = [firstName, lastName]
    .filter((part): part is string => part !== null)
    .join(' ')
    .trim();

  if (fullName.length > 0) {
    return fullName;
  }

  return normalizeText(payload.username) ?? `Telegram ${telegramId}`;
}

function extractTelegramIdentity(
  rawUserPayload: string,
): TelegramIdentity | null {
  try {
    const parsedUser = JSON.parse(rawUserPayload) as TelegramInitDataUserPayload;
    const telegramId =
      typeof parsedUser.id === 'string' || typeof parsedUser.id === 'number'
        ? String(parsedUser.id)
        : null;

    if (telegramId === null || telegramId.trim().length === 0) {
      return null;
    }

    return {
      displayName: buildDisplayName(telegramId, parsedUser),
      telegramId,
    };
  } catch {
    return null;
  }
}

@Injectable()
export class TelegramInitDataValidator {
  constructor(
    @Inject(API_RUNTIME_ENV)
    private readonly runtimeEnv: ApiRuntimeEnv,
  ) {}

  validate(initData: string): TelegramIdentity | null {
    const params = new URLSearchParams(initData);
    const expectedHash = params.get('hash');

    if (typeof expectedHash !== 'string' || expectedHash.length === 0) {
      return null;
    }

    if (!this.hasValidHash(params, expectedHash)) {
      return null;
    }

    const rawUserPayload = params.get('user');

    if (typeof rawUserPayload !== 'string' || rawUserPayload.length === 0) {
      return null;
    }

    return extractTelegramIdentity(rawUserPayload);
  }

  private hasValidHash(
    params: URLSearchParams,
    expectedHash: string,
  ): boolean {
    const dataCheckString = [...params.entries()]
      .filter(([key]) => key !== 'hash')
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    const secret = createHmac('sha256', 'WebAppData')
      .update(this.runtimeEnv.backofficeBotToken)
      .digest();
    const actualHash = createHmac('sha256', secret)
      .update(dataCheckString)
      .digest('hex');
    const expectedHashBuffer = Buffer.from(expectedHash, 'hex');
    const actualHashBuffer = Buffer.from(actualHash, 'hex');

    if (expectedHashBuffer.length !== actualHashBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedHashBuffer, actualHashBuffer);
  }
}
