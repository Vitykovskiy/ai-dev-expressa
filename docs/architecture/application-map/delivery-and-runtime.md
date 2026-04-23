# Delivery And Runtime Application Map

## Граница

Runtime configuration, deployment safety и smoke-check для входа administrator в backoffice.

## Окружения

| Environment       | Telegram auth                    | Test-mode bypass                             |
| ----------------- | -------------------------------- | -------------------------------------------- |
| `production`      | Обязательна                      | Запрещён                                     |
| `test`            | Допустима                        | Разрешён только при `DISABLE_TG_AUTH=true`   |
| local development | Через раздельный запуск контуров | Не должен маскировать production ограничения |

## Branch policy and pipeline

- Pull request в `main` запускает только обязательные проверки `quality` и `build`; PR workflow не выполняет deploy.
- Job `quality` обязан после `npm ci` в корне репозитория, `npm ci --prefix backend` и `npm ci --prefix frontend` проверять `backend` и `frontend` lint, format:check, typecheck, unit tests и связанные статические проверки через root `--prefix`-команды; для `frontend` дополнительно обязателен stylelint.
- Job `build` обязан независимо подтверждать сборку `backend` и `frontend`.
- Обязательные gates не должны работать в warning-only режиме: ошибка любой команды блокирует готовность запроса на слияние.
- Push/merge в `main` запускает `Deploy Test` workflow, публикует versioned runtime-образы и готовит rollout двух test-стендов на одном VPS.
- Secrets для SSH-доступа к VPS, registry credentials и smoke-check overrides хранятся в GitHub Secrets.
- Runtime переменные приложения на VPS передаются через окружение процесса или внешний env-файл стенда и не коммитятся в репозиторий.

## Local dev contract

- `npm install` в корне репозитория устанавливает root tooling `husky` и `lint-staged`.
- `npm install --prefix backend` устанавливает зависимости серверного контура по `backend/package-lock.json`.
- `npm install --prefix frontend` устанавливает зависимости клиентского контура по `frontend/package-lock.json`.
- Backend запускается из корня через `npm run dev:backend` и читает `backend/.env.local`.
- Frontend запускается из корня через `npm run dev:frontend` и читает `frontend/.env.local`.
- Для локального test-mode используются `NODE_ENV=test`, `PORT=3000`, `ADMIN_TELEGRAM_ID=123456789`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`, `VITE_BACKOFFICE_API_BASE_URL=http://127.0.0.1:3000`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- `SERVICE_TELEGRAM_BOT_TOKEN` для local test-mode не требуется.

## Local quality hooks

- Pre-commit hook из `.husky/pre-commit` запускает root-команду `npm run lint-staged` на изменённых файлах.
- `lint-staged` делегирует `prettier --write`, `eslint --fix` и `stylelint --fix` в локальные binaries `backend/` и `frontend/` для staged файлов, где применимо.
- Hooks являются быстрым локальным gate и не заменяют полные `test`, `typecheck` и `build` перед ревью.
- Изменение hooks, lint-staged или npm scripts должно обновлять эту карту и `docs/architecture/devops-standards.md`.

## Test VPS deployment contract

- Ветка `main` является источником автодеплоя на VPS `test`-окружения.
- Workflow `Deploy Test` собирает и публикует versioned backend/frontend runtime images в `ghcr.io` с tag, равным `github.sha`.
- Перед запуском rollout workflow синхронизирует checkout на VPS с `origin/main`, затем вызывает версионированный скрипт `scripts/deploy-test-vps.sh` c `SKIP_GIT_PULL=true`.
- Runtime-конфигурация на VPS передаётся через окружение процесса или внешний env-файл стенда; локальные `backend/.env.local` и `frontend/.env.local` на VPS не используются.
- Оба VPS-стенда `test` и `test-e2e` поднимают backend с `NODE_ENV=test`, `ADMIN_TELEGRAM_ID=<env>` и `DISABLE_TG_AUTH=true`.
- Env-файл стенда должен также содержать `BACKOFFICE_CORS_ORIGINS` с origin опубликованного backoffice; deploy-скрипт проверяет его до container rollout.
- `SERVICE_TELEGRAM_BOT_TOKEN` в окружении задаётся только если стенд должен одновременно проверять Telegram auth path; пустое значение не ломает test-mode bypass сценарий.
- Host test runtime предоставляет `docker`, `docker compose` plugin и `curl`, а launcher использует `docker-compose.deploy.yml` для frontend и backend сервисов.
- Deploy launcher принимает `DEPLOY_BACKEND_IMAGE`, `DEPLOY_FRONTEND_IMAGE`, `DEPLOY_PROJECT_NAME`, `DEPLOY_STAND_SLUG`, выполняет `docker login` при наличии `DEPLOY_REGISTRY_USERNAME` и `DEPLOY_REGISTRY_PASSWORD`, затем запускает `docker compose pull backend frontend` и `docker compose up -d backend frontend`.
- Порт backend на host loopback берётся из `TEST_DEPLOY_HOST_BACKEND_PORT` или `PORT`; frontend публикуется на `TEST_DEPLOY_HOST_FRONTEND_PORT` и по умолчанию использует `8080`.
- Канонический dual-stand contract:

| Stand      | Public hostname                            | `ENV_FILE` example               | `DEPLOY_PROJECT_NAME` | `DEPLOY_STAND_SLUG` | `TEST_DEPLOY_HOST_BACKEND_PORT` | `TEST_DEPLOY_HOST_FRONTEND_PORT` |
| ---------- | ------------------------------------------ | -------------------------------- | --------------------- | ------------------- | ------------------------------- | -------------------------------- |
| `test`     | `https://expressa.vitykovskiy.ru`          | `/opt/expressa/env/test.env`     | `expressa-test`       | `test`              | `3000`                          | `8080`                           |
| `test-e2e` | `https://expressa-e2e-test.vitykovskiy.ru` | `/opt/expressa/env/test-e2e.env` | `expressa-test-e2e`   | `test-e2e`          | `3001`                          | `8081`                           |

- `frontend/nginx.conf` публикует только frontend root и `/backoffice/*` через proxy на `backend:3000`; отдельный публичный backend-домен не требуется для dual-stand deploy contract.
- Post-deploy smoke-check подтверждает `GET /health` через `SMOKE_BACKEND_BASE_URL` или `http://127.0.0.1:${TEST_DEPLOY_HOST_BACKEND_PORT}`, доступность frontend root через `SMOKE_FRONTEND_BASE_URL` или `http://127.0.0.1:${TEST_DEPLOY_HOST_FRONTEND_PORT}`, test-mode доступ к `GET /backoffice/orders` и отказ production-like bypass через config validation внутри backend container.

## Restore path

- Каждый rollout сохраняет rollback-файл в `artifacts/deploy-test/<stand-slug>/rollback-<stand-slug>-<timestamp>.env` с предыдущими image refs и deploy-параметрами стенда.
- Restore path использует нужный rollback-файл как входной env и повторный запуск `SKIP_GIT_PULL=true ./scripts/deploy-test-vps.sh`.
- После restore выполняется тот же smoke-check, что и после штатного rollout.

## Local containerized e2e route

- Финальный feature-level e2e-прогон для `QA-005` выполняется локально как browser suite внутри containerized runtime.
- Backend endpoint suites относятся к integration evidence и не закрывают feature-level e2e acceptance.
- DevOps-owned route должен собирать Docker-контейнер со всем приложением перед e2e-прогоном.
- DevOps-owned route должен запускать backend, frontend и browser e2e внутри локального Docker runtime.
- DevOps-owned route должен иметь одну локальную команду запуска для QA, preflight запуска, runner summary, browser report, логи и явный pass/fail status.
- Локальная команда запуска `QA-005`: `npm run test:e2e:local`.
- DevOps-owned route должен включать минимальную smoke e2e-проверку запуска runner без владения feature assertions `QA-005`.
- QA-owned часть route включает feature scenarios, fixtures, assertions, pass/fail evidence и defect handoff.
- `DO-003`, `scripts/run-test-vps-e2e.sh`, `npm run test:vps:e2e:preflight`, `npm run test:vps:e2e` и workflow `Test VPS E2E` сохраняются только как historical/deprecated baseline для non-gate wrapper route против опубликованного `test` стенда.
- Historical/deprecated test VPS e2e route не является acceptance path для `QA-005`.
- Этот route обслуживает QA-задачи и не является обязательным `PR Checks` или `Deploy Test` gate.

## Env vars

- `ADMIN_TELEGRAM_ID` должен быть задан до запуска backend.
- `DISABLE_TG_AUTH=true` допустим только для test environment.
- `SERVICE_TELEGRAM_BOT_TOKEN` должен быть задан при включённой Telegram auth.
- Секрет служебного Telegram-бота должен передаваться через секреты окружения, а не через исходный код.
- `NODE_ENV=test` обязателен для test VPS.
- `PORT` определяет локальный порт backend для smoke-check; по умолчанию используется `3000`.
- `BACKOFFICE_CORS_ORIGINS` обязан содержать непустой comma-separated список origin, которым backend разрешает browser-доступ к backoffice API.
- `VITE_BACKOFFICE_API_BASE_URL` может быть определён в окружении frontend build во время deploy.
- `VITE_BACKOFFICE_TEST_TELEGRAM_ID` используется только для локального или серверно разрешённого test-mode bypass.
- `ENV_FILE` указывает deploy/e2e launcher на env-файл test-стенда на VPS.
- `DEPLOY_BACKEND_IMAGE` и `DEPLOY_FRONTEND_IMAGE` задают versioned image refs для container rollout.
- `DEPLOY_PROJECT_NAME` задаёт compose project name и изоляцию контейнеров конкретного стенда.
- `DEPLOY_STAND_SLUG` задаёт stand-specific каталог для rollback и summary артефактов; по умолчанию используется нормализованный `DEPLOY_PROJECT_NAME`.
- `DEPLOY_REGISTRY`, `DEPLOY_REGISTRY_USERNAME` и `DEPLOY_REGISTRY_PASSWORD` задают registry login для `docker pull`, если стенд не имеет преднастроенного доступа.
- `TEST_DEPLOY_HOST_BACKEND_PORT` задаёт host loopback port для backend container; по умолчанию используется значение `PORT` или `3000`.
- `TEST_DEPLOY_HOST_FRONTEND_PORT` задаёт host port для frontend container; по умолчанию используется `8080`.
- `SMOKE_BACKEND_BASE_URL` и `SMOKE_FRONTEND_BASE_URL` могут переопределить базовые URL post-deploy smoke-check.
- `TEST_E2E_BACKEND_BASE_URL` задаёт backend target для historical/deprecated DevOps-owned test VPS e2e route.
- `TEST_E2E_BACKOFFICE_ORIGIN` задаёт опубликованный frontend origin для historical/deprecated DevOps-owned test VPS e2e route.
- `TEST_E2E_TELEGRAM_ID` задаёт test-mode Telegram id для preflight и QA-owned e2e command на `test`.
- `TEST_E2E_COMMAND` задаёт QA-owned e2e command; не требуется в `--preflight-only`.
- `TEST_E2E_ENV_FILE` или `ENV_FILE` может указывать на env-файл стенда; wrapper source-ит его до вычисления fallback-переменных e2e route.
- `TEST_E2E_ARTIFACT_DIR` задаёт каталог `.log` и `.summary.md` артефактов; по умолчанию `artifacts/test-vps-e2e`.
- `TEST_E2E_STAND_COMMIT` может явно зафиксировать commit/версию стенда для evidence; если не задан, wrapper пробует SSH lookup через `TEST_E2E_REMOTE_SSH_TARGET` и `TEST_E2E_REMOTE_APP_DIR`, затем локальный `git rev-parse HEAD`.
- `LOCAL_E2E_ARTIFACT_DIR` задаёт каталог evidence для локального containerized e2e runner; по умолчанию `artifacts/qa-005-local-e2e`.
- `LOCAL_E2E_IMAGE_TAG` задаёт Docker image tag локального e2e runner; по умолчанию `expressa-local-e2e:qa-005`.
- `LOCAL_E2E_BASE_IMAGE` задаёт Docker base image локального e2e runner; по умолчанию используется актуальный Playwright image, а runner может выбрать локально закэшированный compatible image для обхода повторного registry pull.
- `LOCAL_E2E_TEST_COMMAND` задаёт команду browser e2e внутри контейнера; по умолчанию `npm --prefix e2e test`.
- `LOCAL_E2E_RUN_ID` задаёт идентификатор локального e2e-прогона; по умолчанию используется UTC timestamp.
- `E2E_BASE_URL` задаёт frontend target внутри контейнера; по умолчанию `http://127.0.0.1:4173`.
- `E2E_BACKEND_BASE_URL` задаёт backend target внутри контейнера; по умолчанию `http://127.0.0.1:3000`.

## Backend commands

- Установка root tooling: `npm install` в корне репозитория.
- Установка backend dependencies: `npm install --prefix backend`.
- Локальный dev из корня: `npm run dev:backend`.
- Lint: `cd backend && npm run lint`.
- Format: `cd backend && npm run format`.
- Format check: `cd backend && npm run format:check`.
- Сборка: `cd backend && npm run build`.
- Typecheck: `cd backend && npm run typecheck`.
- Тесты: `cd backend && npm test`.
- Production-like запуск после сборки: `cd backend && NODE_ENV=production ADMIN_TELEGRAM_ID=<id> SERVICE_TELEGRAM_BOT_TOKEN=<token> npm start`.
- Test-mode без Telegram: `cd backend && NODE_ENV=test ADMIN_TELEGRAM_ID=<id> DISABLE_TG_AUTH=true npm start`.

## Frontend commands

- Установка root tooling: `npm install` в корне репозитория.
- Установка frontend dependencies: `npm install --prefix frontend`.
- Локальный dev из корня: `npm run dev:frontend`.
- Lint: `cd frontend && npm run lint`.
- Stylelint: `cd frontend && npm run stylelint`.
- Format: `cd frontend && npm run format`.
- Format check: `cd frontend && npm run format:check`.
- Сборка: `cd frontend && npm run build`.
- Typecheck: `cd frontend && npm run typecheck`.
- Тесты: `cd frontend && npm test`.

## Smoke-check

- Backend стартует и выполняет идемпотентный bootstrap administrator.
- `npm run dev:backend` поднимает backend на `http://127.0.0.1:3000`.
- `npm run dev:frontend` поднимает frontend на `http://localhost:5173`.
- `GET /health` отвечает в локальном dev-сценарии.
- Локальное открытие backoffice по URL при запущенных `dev:backend` и `dev:frontend` проходит через test-mode и не возвращает `backoffice-auth-failed`.
- Production-like запуск с `DISABLE_TG_AUTH=true` завершается ошибкой конфигурации или блокирует bypass.
- Backoffice без Telegram-входа в production-like режиме не открывает рабочие вкладки.
- Test environment с `DISABLE_TG_AUTH=true` позволяет выполнить проверку role guard без Telegram.
- PR workflow `quality` успешно завершает `backend/frontend` lint, format:check, typecheck и unit tests, а также frontend stylelint.
- PR workflow `build` успешно завершает сборку `backend/frontend`.
- Deploy workflow для `main` после выкладки проверяет `GET /health`, frontend root, test-mode доступ к `GET /backoffice/orders` с заголовком `x-test-telegram-id`, и negative check, подтверждающий, что production-like `DISABLE_TG_AUTH=true` остаётся недопустимым.

## Обновлять эту карту

Карту нужно обновить, если реализация добавляет новые env vars, меняет команды запуска, deployment path, GitHub Actions, smoke-check, local containerized e2e route или historical/deprecated test VPS e2e route.
