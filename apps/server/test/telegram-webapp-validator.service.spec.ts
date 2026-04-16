import { TelegramWebAppValidatorService } from '../src/modules/access/telegram-webapp-validator.service';
import { createSignedTelegramInitData } from './helpers/telegram-init-data';

describe('TelegramWebAppValidatorService', () => {
  const validator = new TelegramWebAppValidatorService();
  const botToken = 'backoffice-bot-token';

  it('accepts a valid Telegram WebApp payload', () => {
    const initData = createSignedTelegramInitData('701001', botToken);

    expect(validator.validate(initData, botToken)).toEqual({
      telegramId: '701001',
    });
  });

  it('rejects a payload with invalid signature', () => {
    const initData = createSignedTelegramInitData('701001', botToken).replace('hash=', 'hash=broken');

    expect(() => validator.validate(initData, botToken)).toThrow('Telegram context signature is invalid');
  });
});

