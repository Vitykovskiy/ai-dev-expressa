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
- Канонический runtime маршрут после merge в `main`: rollout стенда `test`, затем rollout стенда `test-e2e`; QA запускает локальный `npm run test:e2e` против `https://expressa-e2e-test.vitykovskiy.ru`.
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

- `frontend/nginx.conf` публикует frontend root, `/backoffice/*` и `/customer/*` через proxy на `backend:3000`; отдельный публичный backend-домен не требуется для dual-stand deploy contract.
- Post-deploy smoke-check подтверждает `GET /health` через `SMOKE_BACKEND_BASE_URL` или `http://127.0.0.1:${TEST_DEPLOY_HOST_BACKEND_PORT}`, доступность frontend root через `SMOKE_FRONTEND_BASE_URL` или `http://127.0.0.1:${TEST_DEPLOY_HOST_FRONTEND_PORT}`, test-mode доступ к `GET /backoffice/orders` и отказ production-like bypass через config validation внутри backend container.

## Restore path

- Каждый rollout сохраняет rollback-файл в `artifacts/deploy-test/<stand-slug>/rollback-<stand-slug>-<timestamp>.env` с предыдущими image refs и deploy-параметрами стенда.
- Restore path использует нужный rollback-файл как входной env и повторный запуск `SKIP_GIT_PULL=true ./scripts/deploy-test-vps.sh`.
- После restore выполняется тот же smoke-check, что и после штатного rollout.

## QA e2e route

- Финальный feature-level e2e-прогон выполняется локально против опубликованного `test-e2e` стенда.
- Backend endpoint suites относятся к integration evidence и не закрывают feature-level e2e acceptance.
- Каноническая команда запуска: `npm run test:e2e`.
- Playwright по умолчанию использует `https://expressa-e2e-test.vitykovskiy.ru`.
- `E2E_BASE_URL` задаёт локальный override frontend origin для QA.
- `E2E_BACKEND_BASE_URL` задаёт локальный override backend API base URL для тестов, которым нужен прямой JSON-доступ к backend API; canonical значение для `test-e2e` совпадает с published frontend origin, потому что `/customer/*` проксируется через frontend nginx на backend.
- `E2E_TEST_TELEGRAM_ID` задаёт test-mode Telegram id для QA-owned Playwright suite.
- QA-owned route включает feature scenarios, fixtures, assertions, pass/fail evidence и defect handoff.
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
- `ENV_FILE` указывает deploy launcher на env-файл test-стенда на VPS.
- `DEPLOY_BACKEND_IMAGE` и `DEPLOY_FRONTEND_IMAGE` задают versioned image refs для container rollout.
- `DEPLOY_PROJECT_NAME` задаёт compose project name и изоляцию контейнеров конкретного стенда.
- `DEPLOY_STAND_SLUG` задаёт stand-specific каталог для rollback и summary артефактов; по умолчанию используется нормализованный `DEPLOY_PROJECT_NAME`.
- `DEPLOY_REGISTRY`, `DEPLOY_REGISTRY_USERNAME` и `DEPLOY_REGISTRY_PASSWORD` задают registry login для `docker pull`, если стенд не имеет преднастроенного доступа.
- `TEST_DEPLOY_HOST_BACKEND_PORT` задаёт host loopback port для backend container; по умолчанию используется значение `PORT` или `3000`.
- `TEST_DEPLOY_HOST_FRONTEND_PORT` задаёт host port для frontend container; по умолчанию используется `8080`.
- `SMOKE_BACKEND_BASE_URL` и `SMOKE_FRONTEND_BASE_URL` могут переопределить базовые URL post-deploy smoke-check.
- `E2E_BASE_URL` задаёт локальный override frontend origin для QA-owned Playwright command; по умолчанию используется `https://expressa-e2e-test.vitykovskiy.ru`.
- `E2E_TEST_TELEGRAM_ID` задаёт test Telegram id для QA-owned Playwright command.
- `E2E_STAND_COMMIT` задаёт commit/версию проверяемого опубликованного стенда для QA evidence.
- `E2E_BACKEND_BASE_URL` задаёт backend API base URL для QA-owned Playwright command; для `test-e2e` canonical значение совпадает с `https://expressa-e2e-test.vitykovskiy.ru`.
- `IP`, `ROOT_USER`, `ROOT_PASSWORD` в корневом `.env` задают параметры подключения к серверу для локальных operational сценариев; `ROOT_PASSWORD` не коммитится и хранится только в локальном окружении исполнителя или секретном хранилище.

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
- `npm run test:e2e` запускает QA-owned Playwright suite против `https://expressa-e2e-test.vitykovskiy.ru` без локальной сборки backend/frontend.

## Обновлять эту карту

Карту нужно обновить, если реализация добавляет новые env vars, меняет команды запуска, deployment path, GitHub Actions, smoke-check или QA e2e route.
