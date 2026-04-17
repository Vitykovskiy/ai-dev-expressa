import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { BackofficeAccessError } from '../../application/errors/backoffice-access.error';

interface TelegramInitDataUser {
  id: number | string;
}

export interface ValidatedTelegramContext {
  telegramId: string;
}

@Injectable()
export class TelegramWebAppValidatorService {
  validate(initData: string, botToken: string): ValidatedTelegramContext {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const encodedUser = params.get('user');

    if (!hash || !encodedUser) {
      throw new BackofficeAccessError(
        'telegram-context-invalid',
        401,
        'Telegram context is incomplete',
      );
    }

    const dataCheckString = [...params.entries()]
      .filter(([key]) => key !== 'hash')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const expectedHash = createHmac('sha256', secret).update(dataCheckString).digest('hex');

    if (!this.safeHashEquals(expectedHash, hash)) {
      throw new BackofficeAccessError(
        'telegram-context-invalid',
        401,
        'Telegram context signature is invalid',
      );
    }

    let user: TelegramInitDataUser;

    try {
      user = JSON.parse(encodedUser) as TelegramInitDataUser;
    } catch {
      throw new BackofficeAccessError(
        'telegram-context-invalid',
        401,
        'Telegram user payload is invalid JSON',
      );
    }

    if ((typeof user.id !== 'number' && typeof user.id !== 'string') || `${user.id}`.trim() === '') {
      throw new BackofficeAccessError(
        'telegram-context-invalid',
        401,
        'Telegram user identifier is missing',
      );
    }

    return {
      telegramId: String(user.id),
    };
  }

  private safeHashEquals(expectedHash: string, receivedHash: string): boolean {
    const expected = Buffer.from(expectedHash, 'hex');
    const actual = Buffer.from(receivedHash, 'hex');

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}
