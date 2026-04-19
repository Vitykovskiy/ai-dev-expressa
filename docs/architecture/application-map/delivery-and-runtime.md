# Delivery And Runtime Application Map

## Граница

Runtime configuration, deployment safety и smoke-check для входа administrator в backoffice.

## Окружения

| Environment | Telegram auth | Test-mode bypass |
|---|---|---|
| `production` | Обязательна | Запрещён |
| `test` | Допустима | Разрешён только при `DISABLE_TG_AUTH=true` |
| local development | Определяется проектной конфигурацией | Не должен маскировать production ограничения |

## Env vars

- `ADMIN_TELEGRAM_ID` должен быть задан до запуска backend.
- `DISABLE_TG_AUTH=true` допустим только для test environment.
- `SERVICE_TELEGRAM_BOT_TOKEN` должен быть задан при включённой Telegram auth.
- Секрет служебного Telegram-бота должен передаваться через секреты окружения, а не через исходный код.

## Backend commands

- Установка: `cd backend && npm install`.
- Сборка: `cd backend && npm run build`.
- Тесты: `cd backend && npm test`.
- Production-like запуск после сборки: `cd backend && NODE_ENV=production ADMIN_TELEGRAM_ID=<id> SERVICE_TELEGRAM_BOT_TOKEN=<token> npm start`.
- Test-mode без Telegram: `cd backend && NODE_ENV=test ADMIN_TELEGRAM_ID=<id> DISABLE_TG_AUTH=true npm start`.

## Smoke-check

- Backend стартует и выполняет идемпотентный bootstrap administrator.
- Production-like запуск с `DISABLE_TG_AUTH=true` завершается ошибкой конфигурации или блокирует bypass.
- Backoffice без Telegram-входа в production-like режиме не открывает рабочие вкладки.
- Test environment с `DISABLE_TG_AUTH=true` позволяет выполнить проверку role guard без Telegram.
- `cd backend && npm run build && npm test && npm audit --audit-level=moderate` завершается успешно.

## Обновлять эту карту

Карту нужно обновить, если реализация добавляет новые env vars, меняет команды запуска, deployment path, GitHub Actions или smoke-check.
