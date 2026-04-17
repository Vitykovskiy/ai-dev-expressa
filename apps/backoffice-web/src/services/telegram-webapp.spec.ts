import { readBackofficeBootstrapRequest, readTelegramInitData } from './telegram-webapp';

describe('telegram-webapp', () => {
  it('uses Telegram initData when the web app context is available', () => {
    expect(
      readBackofficeBootstrapRequest(
        {
          disableTelegramAuth: false,
          testTelegramId: null,
        },
        {
          initData: ' signed-telegram-init-data ',
        },
      ),
    ).toEqual({
      mode: 'telegram',
      telegramInitData: 'signed-telegram-init-data',
    });
  });

  it('falls back to test mode when Telegram auth is disabled', () => {
    expect(
      readBackofficeBootstrapRequest(
        {
          disableTelegramAuth: true,
          testTelegramId: '710001',
        },
        null,
      ),
    ).toEqual({
      mode: 'test',
      testTelegramId: '710001',
    });
  });

  it('throws a pre-bootstrap denial when Telegram context is required', () => {
    try {
      readBackofficeBootstrapRequest(
        {
          disableTelegramAuth: false,
          testTelegramId: null,
        },
        null,
      );
    } catch (error) {
      expect(error).toEqual({
        statusCode: 401,
        reason: 'telegram-context-required',
        message:
          'Telegram-контекст служебного бота обязателен для рабочего входа во внутренний административный контур.',
      });
      return;
    }

    throw new Error('Expected a pre-bootstrap denial');
  });

  it('normalizes missing initData to null', () => {
    expect(readTelegramInitData({ initData: '   ' })).toBeNull();
  });
});
