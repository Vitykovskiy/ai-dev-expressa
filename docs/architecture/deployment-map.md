# Deployment Map

## Окружения

| Environment | Назначение | Ограничение |
|---|---|---|
| `production` | Рабочий контур | Telegram auth обязательна; `DISABLE_TG_AUTH=true` запрещён. |
| `test` | Проверочный контур | Может использовать `DISABLE_TG_AUTH=true` для воспроизводимых проверок. |

## FEATURE-001

Конкретные env vars, smoke-check и правила runtime для входа administrator описаны в `docs/architecture/application-map/delivery-and-runtime.md`.
