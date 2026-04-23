# Deployment Map

## Окружения

| Environment  | Назначение         | Ограничение                                                             |
| ------------ | ------------------ | ----------------------------------------------------------------------- |
| `production` | Рабочий контур     | Telegram auth обязательна; `DISABLE_TG_AUTH=true` запрещён.             |
| `test`       | Проверочный контур | Может использовать `DISABLE_TG_AUTH=true` для воспроизводимых проверок. |

## Branch-to-environment mapping

| Source branch/event      | Target environment | Delivery rule                                                                                                                                |
| ------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `pull_request` -> `main` | нет                | Выполняются только обязательные проверки `quality` и `build` из workflow `PR Checks`; deploy запрещён.                                       |
| `push`/merge -> `main`   | `test`             | Выполняется публикация versioned образов; rollout стендов `test` и `test-e2e` на одном VPS настраивается отдельным deploy workflow contract. |

## PR Checks install contract

- Workflow `PR Checks` устанавливает root tooling через `npm ci`, backend через `npm ci --prefix backend` и frontend через `npm ci --prefix frontend`.
- Workflow `PR Checks` использует `package-lock.json`, `backend/package-lock.json` и `frontend/package-lock.json` как воспроизводимые источники npm cache и install state.
- Check-run names для merge admission остаются `quality` и `build`.

## Test deployment contract

- Workflow `Deploy Test` собирает и публикует versioned backend/frontend images в `ghcr.io`; эти же образы должны переиспользоваться для двух изолированных стендов на одном VPS.
- VPS `test` использует checkout из `main` только как источник versioned deploy-артефактов `scripts/deploy-test-vps.sh` и `docker-compose.deploy.yml`.
- Runtime-конфигурация на VPS передаётся через окружение процесса или внешний env-файл стенда; локальные `backend/.env.local` и `frontend/.env.local` на VPS не используются.
- Backend на `test` запускается в `NODE_ENV=test`.
- `DISABLE_TG_AUTH=true` допустим только для `test` и не переносится в `production`.
- Env-файл стенда обязан содержать все runtime vars backend до container rollout: `NODE_ENV=test`, `PORT`, `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS` с origin опубликованного backoffice.
- Изоляция двух стендов обеспечивается отдельными значениями `ENV_FILE`, `DEPLOY_PROJECT_NAME`, `DEPLOY_STAND_SLUG`, `TEST_DEPLOY_HOST_BACKEND_PORT`, `TEST_DEPLOY_HOST_FRONTEND_PORT`, `SMOKE_BACKEND_BASE_URL` и `SMOKE_FRONTEND_BASE_URL`.
- Базовый контракт стендов:

| Stand      | Public hostname                            | `DEPLOY_PROJECT_NAME` | `DEPLOY_STAND_SLUG` | `ENV_FILE` example               | `TEST_DEPLOY_HOST_BACKEND_PORT` | `TEST_DEPLOY_HOST_FRONTEND_PORT` | `SMOKE_BACKEND_BASE_URL` | `SMOKE_FRONTEND_BASE_URL`                  |
| ---------- | ------------------------------------------ | --------------------- | ------------------- | -------------------------------- | ------------------------------- | -------------------------------- | ------------------------ | ------------------------------------------ |
| `test`     | `https://expressa.vitykovskiy.ru`          | `expressa-test`       | `test`              | `/opt/expressa/env/test.env`     | `3000`                          | `8080`                           | `http://127.0.0.1:3000`  | `https://expressa.vitykovskiy.ru`          |
| `test-e2e` | `https://expressa-e2e-test.vitykovskiy.ru` | `expressa-test-e2e`   | `test-e2e`          | `/opt/expressa/env/test-e2e.env` | `3001`                          | `8081`                           | `http://127.0.0.1:3001`  | `https://expressa-e2e-test.vitykovskiy.ru` |

- GitHub Actions хранит инфраструктурные секреты для SSH и rollout: `TEST_VPS_HOST`, `TEST_VPS_USER`, `TEST_VPS_SSH_KEY`, `TEST_VPS_PORT`, `TEST_VPS_HOST_FINGERPRINT`, `TEST_VPS_APP_DIR`, registry credentials и отдельные env values для каждого стенда.
- Deploy workflow синхронизирует checkout на VPS с `origin/main`, затем многократно запускает `scripts/deploy-test-vps.sh` с `SKIP_GIT_PULL=true`; launcher валидирует runtime env, выполняет `docker login` при наличии credentials, затем `docker compose pull` и `docker compose up -d`.
- `docker-compose.deploy.yml` совместим с rollout двух стендов без изменений, потому что использует env-driven image refs и host port bindings, а изоляция контейнеров задаётся через `docker compose -p`.
- Post-deploy smoke-check должен выполняться отдельно для каждого стенда: backend health по `SMOKE_BACKEND_BASE_URL` или `http://127.0.0.1:${TEST_DEPLOY_HOST_BACKEND_PORT}`, frontend root по `SMOKE_FRONTEND_BASE_URL` или `http://127.0.0.1:${TEST_DEPLOY_HOST_FRONTEND_PORT}`, test-mode доступ к `GET /backoffice/orders` и negative path для production-like bypass.
- Production deployment этим flow не затрагивается и требует отдельного канала поставки.

## Local containerized e2e route

- Feature-level e2e acceptance для `QA-005` запускается локально как browser suite внутри containerized runtime; e2e не является частью обязательного `PR Checks` или `Deploy Test` gate.
- Локальный containerized route должен собирать Docker-контейнер со всем приложением перед e2e-прогоном.
- Локальный containerized route должен запускать backend, frontend и browser e2e внутри локального Docker runtime.
- Локальный containerized route должен выполнять preflight запуска, сохранять pass/fail evidence и возвращать воспроизводимый код завершения.
- Локальная команда запуска `QA-005`: `npm run test:e2e:local`.
- DevOps предоставляет runner и smoke e2e-проверку маршрута запуска по отдельной подзадаче QA-005/02; QA предоставляет feature scenarios, fixtures, assertions и defect handoff.
- `DO-003`, `scripts/run-test-vps-e2e.sh`, `npm run test:vps:e2e:preflight`, `npm run test:vps:e2e` и workflow `Test VPS E2E` являются historical/deprecated baseline для запуска QA-owned команды против опубликованного `test` стенда и не являются acceptance path для `QA-005`.
- Минимальный output e2e route: commit/версия проверяемого кода, локальные backend/frontend targets внутри runner, результат preflight, результат browser e2e run, путь к runner summary, логам и browser report артефактам.
- Smoke-check и restore path остаются отдельными delivery/runtime проверками и не заменяют e2e acceptance.

## Required GitHub checks

- Workflow `PR Checks` публикует обязательные check-runs:
- `quality`
- `build`

Workflow `Test VPS E2E` является historical/deprecated non-gate route и не должен добавляться в branch protection без отдельного архитектурного решения.

## Restore path

- После каждого rollout `scripts/deploy-test-vps.sh` сохраняет rollback-файл в `artifacts/deploy-test/<stand-slug>/rollback-<stand-slug>-<timestamp>.env` с предыдущими image refs, env-файлом и deploy-параметрами конкретного стенда.
- Для restore оператор source-ит нужный rollback-файл, затем повторно запускает `SKIP_GIT_PULL=true ./scripts/deploy-test-vps.sh` в `TEST_VPS_APP_DIR`.
- После restore оператор повторяет smoke-check `GET /health`, frontend root и `GET /backoffice/orders` в test-mode.

## FEATURE-001

Конкретные env vars, smoke-check и правила runtime для входа administrator описаны в `docs/architecture/application-map/delivery-and-runtime.md`.
