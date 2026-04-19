# Deployment Map

## Окружения

| Environment  | Назначение         | Ограничение                                                             |
| ------------ | ------------------ | ----------------------------------------------------------------------- |
| `production` | Рабочий контур     | Telegram auth обязательна; `DISABLE_TG_AUTH=true` запрещён.             |
| `test`       | Проверочный контур | Может использовать `DISABLE_TG_AUTH=true` для воспроизводимых проверок. |

## Branch-to-environment mapping

| Source branch/event      | Target environment | Delivery rule                                                                                          |
| ------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------ |
| `pull_request` -> `main` | нет                | Выполняются только обязательные проверки `quality` и `build` из workflow `PR Checks`; deploy запрещён. |
| `push`/merge -> `main`   | `test`             | Выполняется автодеплой на VPS test-окружения и post-deploy smoke-check.                                |

## Test deployment contract

- VPS `test` получает код только из `main`.
- Корневой `.env` на VPS является источником runtime-конфигурации для backend и frontend build.
- Backend на `test` запускается в `NODE_ENV=test`.
- `DISABLE_TG_AUTH=true` допустим только для `test` и не переносится в `production`.
- GitHub Actions хранит только инфраструктурные секреты: `TEST_VPS_HOST`, `TEST_VPS_USER`, `TEST_VPS_SSH_KEY`, `TEST_VPS_PORT`, `TEST_VPS_HOST_FINGERPRINT`, `TEST_VPS_APP_DIR`, `TEST_DEPLOY_RESTART_COMMAND`, опционально `TEST_VPS_ENV_FILE` и `TEST_SMOKE_BACKEND_BASE_URL`.
- Deploy workflow обновляет checkout на VPS, запускает `scripts/deploy-test-vps.sh`, затем выполняет smoke-check по локальному адресу `http://127.0.0.1:${PORT:-3000}` или по `TEST_SMOKE_BACKEND_BASE_URL`.
- Production deployment этим flow не затрагивается и требует отдельного канала поставки.

## Required GitHub checks

- Workflow `PR Checks` публикует обязательные check-runs:
- `quality`
- `build`

## Restore path

- Если deploy на `main` падает после `git pull`, оператор на VPS возвращает предыдущий стабильный commit вручную через `git checkout <commit>` в `TEST_VPS_APP_DIR` и повторно выполняет restart-команду из `TEST_DEPLOY_RESTART_COMMAND`.
- После restore обязательно повторить локальный smoke-check `GET /health` и `GET /backoffice/orders` в test-mode.

## FEATURE-001

Конкретные env vars, smoke-check и правила runtime для входа administrator описаны в `docs/architecture/application-map/delivery-and-runtime.md`.
