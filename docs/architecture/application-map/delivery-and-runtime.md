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
- Секрет служебного Telegram-бота должен передаваться через секреты окружения, а не через исходный код.

## Smoke-check

- Backend стартует и выполняет идемпотентный bootstrap administrator.
- Production-like запуск с `DISABLE_TG_AUTH=true` завершается ошибкой конфигурации или блокирует bypass.
- Backoffice без Telegram-входа в production-like режиме не открывает рабочие вкладки.
- Test environment с `DISABLE_TG_AUTH=true` позволяет выполнить проверку role guard без Telegram.

## Обновлять эту карту

Карту нужно обновить, если реализация добавляет новые env vars, меняет команды запуска, deployment path, GitHub Actions или smoke-check.
