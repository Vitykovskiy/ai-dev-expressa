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
- Runtime-конфигурация на VPS передаётся через окружение процесса или внешний env-файл стенда; локальные `backend/.env.local` и `frontend/.env.local` на VPS не используются.
- Backend на `test` запускается в `NODE_ENV=test`.
- `DISABLE_TG_AUTH=true` допустим только для `test` и не переносится в `production`.
- Env-файл стенда обязан содержать все runtime vars backend до рестарта: `NODE_ENV=test`, `PORT`, `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS` с origin опубликованного backoffice, `BACKOFFICE_PUBLIC_URL` для проверки опубликованного frontend origin.
- GitHub Actions хранит инфраструктурные secrets: `TEST_VPS_HOST`, `TEST_VPS_USER`, `TEST_VPS_SSH_KEY`, `TEST_VPS_PORT`, `TEST_VPS_HOST_FINGERPRINT`, `TEST_VPS_APP_DIR`, `TEST_DEPLOY_RESTART_COMMAND`, опционально `TEST_DEPLOY_FRONTEND_RESTART_COMMAND`, `TEST_VPS_ENV_FILE` и `TEST_SMOKE_BACKEND_BASE_URL`.
- GitHub environment `test` хранит non-secret vars `BACKOFFICE_PUBLIC_URL`, опционально `FRONTEND_PUBLISH_DIR` и `SERVER_PORT`.
- Deploy workflow обновляет checkout на VPS, запускает `scripts/deploy-test-vps.sh`, валидирует runtime env до рестарта, собирает `frontend`, при заданном `FRONTEND_PUBLISH_DIR` копирует `frontend/dist` в опубликованный каталог, затем выполняет smoke-check по локальному backend адресу `http://127.0.0.1:${PORT:-3000}` или по `TEST_SMOKE_BACKEND_BASE_URL` и проверяет `BACKOFFICE_PUBLIC_URL`.
- Production deployment этим flow не затрагивается и требует отдельного канала поставки.

## Test VPS e2e route

- Feature-level e2e acceptance запускается после успешного `main -> test` deploy и post-deploy smoke-check; e2e не является частью обязательного `PR Checks` или `Deploy Test` gate.
- Test VPS e2e route должен проверять доступность backend health, опубликованного backoffice origin, test-mode доступа и всех env/secrets, нужных QA для запуска сценариев против стенда.
- DevOps предоставляет `scripts/run-test-vps-e2e.sh` и root wrappers `npm run test:vps:e2e:preflight` / `npm run test:vps:e2e` для preflight и запуска QA-owned e2e command against deployed `test`; QA предоставляет сами сценарии и фиксирует pass/fail evidence.
- Ручной workflow `Test VPS E2E` запускается только через `workflow_dispatch`, подключается к GitHub environment `test`, использует уже заведенные secrets/vars для SSH и runtime route, выполняет wrapper на VPS и не входит в обязательные `PR Checks` / `Deploy Test`.
- Runtime inputs для QA можно задать явно через `TEST_E2E_BACKEND_BASE_URL`, `TEST_E2E_BACKOFFICE_ORIGIN`, `TEST_E2E_TELEGRAM_ID`; при запуске на VPS wrapper также принимает существующие имена `TEST_SMOKE_BACKEND_BASE_URL` или `PORT`/`SERVER_PORT`, `BACKOFFICE_PUBLIC_URL` или первый `BACKOFFICE_CORS_ORIGINS`, `ADMIN_TELEGRAM_ID`.
- Для полного запуска также нужен `TEST_E2E_COMMAND`; при передаче через SSH workflow использует shell-safe payload `TEST_E2E_COMMAND_B64`, чтобы не ломать run command пробелами в `envs`.
- Опциональные inputs: `TEST_E2E_ENV_FILE`, `ENV_FILE`, `TEST_E2E_COMMAND_B64`, `TEST_E2E_ARTIFACT_DIR`, `TEST_E2E_HEALTH_PATH`, `TEST_E2E_API_PROBE_PATH`, `TEST_E2E_FRONTEND_PATH`, `TEST_E2E_CURL_TIMEOUT`, `TEST_E2E_STAND_COMMIT`, `TEST_E2E_REMOTE_SSH_TARGET`, `TEST_E2E_REMOTE_SSH_PORT`, `TEST_E2E_REMOTE_APP_DIR`.
- Минимальный output e2e route: commit/версия стенда, целевые backend/frontend URL, результат preflight, результат e2e run и путь к `.log` и `.summary.md` артефактам.
- Smoke-check и restore path остаются отдельными delivery/runtime проверками и не заменяют e2e acceptance.

## Required GitHub checks

- Workflow `PR Checks` публикует обязательные check-runs:
- `quality`
- `build`

Workflow `Test VPS E2E` не является required check и не должен добавляться в branch protection без отдельного архитектурного решения.

## Restore path

- Если deploy на `main` падает после `git pull`, оператор на VPS возвращает предыдущий стабильный commit вручную через `git checkout <commit>` в `TEST_VPS_APP_DIR` и повторно выполняет restart-команду из `TEST_DEPLOY_RESTART_COMMAND`.
- После restore обязательно повторить локальный smoke-check `GET /health` и `GET /backoffice/orders` в test-mode.

## FEATURE-001

Конкретные env vars, smoke-check и правила runtime для входа administrator описаны в `docs/architecture/application-map/delivery-and-runtime.md`.
