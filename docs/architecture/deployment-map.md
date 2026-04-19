# Deployment Map

## Окружения

| Environment | Назначение | Ограничение |
|---|---|---|
| `production` | Рабочий контур | Telegram auth обязательна; `DISABLE_TG_AUTH=true` запрещён. |
| `test` | Проверочный контур | Может использовать `DISABLE_TG_AUTH=true` для воспроизводимых проверок. |

## Branch-to-environment mapping

| Source branch/event | Target environment | Delivery rule |
|---|---|---|
| `pull_request` -> `main` | нет | Выполняются только обязательные проверки `quality` и `build`; deploy запрещён. |
| `push`/merge -> `main` | `test` | Выполняется автодеплой на VPS test-окружения и post-deploy smoke-check. |

## Test deployment contract

- VPS `test` получает код только из `main`.
- Backend на `test` запускается в `NODE_ENV=test`.
- `DISABLE_TG_AUTH=true` допустим только для `test` и не переносится в `production`.
- Production deployment этим flow не затрагивается и требует отдельного канала поставки.

## FEATURE-001

Конкретные env vars, smoke-check и правила runtime для входа administrator описаны в `docs/architecture/application-map/delivery-and-runtime.md`.
