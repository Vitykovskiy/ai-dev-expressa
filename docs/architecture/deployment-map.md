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

## PR Checks install contract

- Workflow `PR Checks` устанавливает root tooling через `npm ci`, backend через `npm ci --prefix backend` и frontend через `npm ci --prefix frontend`.
- Workflow `PR Checks` использует `package-lock.json`, `backend/package-lock.json` и `frontend/package-lock.json` как воспроизводимые источники npm cache и install state.
- Check-run names для merge admission остаются `quality` и `build`.

## Test deployment contract

- Workflow `Deploy Test` собирает и публикует versioned backend/frontend images в `ghcr.io`, затем запускает rollout на VPS `test`.
- VPS `test` использует checkout из `main` только как источник versioned deploy-артефактов `scripts/deploy-test-vps.sh` и `docker-compose.deploy.yml`.
- Runtime-конфигурация на VPS передаётся через окружение процесса или внешний env-файл стенда; локальные `backend/.env.local` и `frontend/.env.local` на VPS не используются.
- Backend на `test` запускается в `NODE_ENV=test`.
- `DISABLE_TG_AUTH=true` допустим только для `test` и не переносится в `production`.
- Env-файл стенда обязан содержать все runtime vars backend до container rollout: `NODE_ENV=test`, `PORT`, `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS` с origin опубликованного backoffice.
- GitHub Actions хранит инфраструктурные секреты для SSH и rollout: `TEST_VPS_HOST`, `TEST_VPS_USER`, `TEST_VPS_SSH_KEY`, `TEST_VPS_PORT`, `TEST_VPS_HOST_FINGERPRINT`, `TEST_VPS_APP_DIR`, опционально `TEST_VPS_ENV_FILE`, `TEST_DEPLOY_REGISTRY_USERNAME`, `TEST_DEPLOY_REGISTRY_PASSWORD`, `TEST_SMOKE_BACKEND_BASE_URL`, `TEST_SMOKE_FRONTEND_BASE_URL`.
- Deploy workflow синхронизирует checkout на VPS с `origin/main`, запускает `scripts/deploy-test-vps.sh` с `SKIP_GIT_PULL=true`, а launcher валидирует runtime env, выполняет `docker login` при наличии credentials, затем `docker compose pull` и `docker compose up -d`.
- Post-deploy smoke-check проверяет backend health по `http://127.0.0.1:${PORT:-3000}` или `TEST_SMOKE_BACKEND_BASE_URL`, frontend root по `http://127.0.0.1:${TEST_DEPLOY_HOST_FRONTEND_PORT:-8080}` или `TEST_SMOKE_FRONTEND_BASE_URL`, test-mode доступ к `GET /backoffice/orders` и negative path для production-like bypass.
- Production deployment этим flow не затрагивается и требует отдельного канала поставки.

## Test VPS e2e route

- Feature-level e2e acceptance запускается как browser suite после успешного `main -> test` deploy и post-deploy smoke-check; e2e не является частью обязательного `PR Checks` или `Deploy Test` gate.
- Test VPS e2e route должен проверять доступность backend health, опубликованного backoffice origin, test-mode доступа и всех env/secrets, нужных QA для запуска browser scenarios против стенда.
- DevOps предоставляет `scripts/run-test-vps-e2e.sh` и root wrappers `npm run test:vps:e2e:preflight` / `npm run test:vps:e2e` для preflight и запуска QA-owned e2e command against deployed `test`; QA предоставляет сами сценарии и фиксирует pass/fail evidence.
- `DO-003` route остается baseline для запуска QA-owned команды против опубликованного `test` стенда.
- `DO-009` route для `FEATURE-002` должен добавить isolated compose project или эквивалентную изоляцию, browser report artifacts и cleanup после pass/fail.
- Ручной workflow `Test VPS E2E` запускается только через `workflow_dispatch`, подключается к GitHub environment `test`, использует уже заведенные secrets/vars для SSH и runtime route, выполняет wrapper на VPS и не входит в обязательные `PR Checks` / `Deploy Test`.
- Runtime inputs для QA можно задать явно через `TEST_E2E_BACKEND_BASE_URL`, `TEST_E2E_BACKOFFICE_ORIGIN`, `TEST_E2E_TELEGRAM_ID`; при запуске на VPS wrapper также принимает существующие имена `TEST_SMOKE_BACKEND_BASE_URL` или `PORT`/`SERVER_PORT`, `BACKOFFICE_PUBLIC_URL` или первый `BACKOFFICE_CORS_ORIGINS`, `ADMIN_TELEGRAM_ID`.
- Для полного запуска также нужен `TEST_E2E_COMMAND`; preflight-only режим его не требует.
- Опциональные inputs: `TEST_E2E_ENV_FILE`, `ENV_FILE`, `TEST_E2E_ARTIFACT_DIR`, `TEST_E2E_HEALTH_PATH`, `TEST_E2E_API_PROBE_PATH`, `TEST_E2E_FRONTEND_PATH`, `TEST_E2E_CURL_TIMEOUT`, `TEST_E2E_STAND_COMMIT`, `TEST_E2E_REMOTE_SSH_TARGET`, `TEST_E2E_REMOTE_SSH_PORT`, `TEST_E2E_REMOTE_APP_DIR`.
- Минимальный output e2e route: commit/версия стенда, целевые backend/frontend URL, идентификатор isolated route, результат preflight, результат browser e2e run, путь к `.log`, `.summary.md` и browser report артефактам.
- Smoke-check и restore path остаются отдельными delivery/runtime проверками и не заменяют e2e acceptance.

## Required GitHub checks

- Workflow `PR Checks` публикует обязательные check-runs:
- `quality`
- `build`

Workflow `Test VPS E2E` не является required check и не должен добавляться в branch protection без отдельного архитектурного решения.

## Restore path

- После каждого rollout `scripts/deploy-test-vps.sh` сохраняет в `artifacts/deploy-test/rollback-<timestamp>.env` предыдущие image refs и deploy-параметры стенда.
- Для restore оператор source-ит нужный rollback-файл, затем повторно запускает `SKIP_GIT_PULL=true ./scripts/deploy-test-vps.sh` в `TEST_VPS_APP_DIR`.
- После restore оператор повторяет smoke-check `GET /health`, frontend root и `GET /backoffice/orders` в test-mode.

## FEATURE-001

Конкретные env vars, smoke-check и правила runtime для входа administrator описаны в `docs/architecture/application-map/delivery-and-runtime.md`.
