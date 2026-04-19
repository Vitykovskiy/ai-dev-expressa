# DevOps Standards

## Базовый стандарт

- Секреты Telegram-ботов и production env values не хранятся в исходном коде.
- Test-only режимы должны иметь явную защиту от включения в production.
- Smoke-check должен проверять не только успешный запуск, но и критичные negative paths для доступа.

## Для FEATURE-001

Подробная runtime карта для `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и smoke-check находится в `docs/architecture/application-map/delivery-and-runtime.md`.
