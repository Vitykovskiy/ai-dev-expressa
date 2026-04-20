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
- Job `quality` обязан после `npm ci` в корне репозитория проверять `backend` и `frontend` lint, format:check, typecheck, unit tests и связанные статические проверки через root workspace-команды; для `frontend` дополнительно обязателен stylelint.
- Job `build` обязан независимо подтверждать сборку `backend` и `frontend`.
- Обязательные gates не должны работать в warning-only режиме: ошибка любой команды блокирует готовность запроса на слияние.
- Push/merge в `main` запускает `Deploy Test` workflow и деплоит только `test`-окружение на VPS.
- Secrets для SSH-доступа к VPS и удалённой restart-команды хранятся в GitHub Secrets.
- Runtime переменные приложения на VPS передаются через окружение процесса или внешний env-файл стенда и не коммитятся в репозиторий.

## Local dev contract

- `npm install` в корне репозитория устанавливает root tooling и зависимости `backend/frontend` через `npm workspaces`.
- Backend запускается из корня через `npm run dev:backend` и читает `backend/.env.local`.
- Frontend запускается из корня через `npm run dev:frontend` и читает `frontend/.env.local`.
- Для локального test-mode используются `NODE_ENV=test`, `PORT=3000`, `ADMIN_TELEGRAM_ID=123456789`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`, `VITE_BACKOFFICE_API_BASE_URL=http://127.0.0.1:3000`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- `SERVICE_TELEGRAM_BOT_TOKEN` для local test-mode не требуется.

## Local quality hooks

- Pre-commit hook из `.husky/pre-commit` запускает root-команду `npm run lint-staged` на изменённых файлах.
- `lint-staged` применяет `prettier --write` к staged text-файлам, `eslint --fix` к staged backend/frontend TypeScript/Vue файлам и `stylelint --fix` к staged frontend style blocks или style files, где применимо.
- Hooks являются быстрым локальным gate и не заменяют полные `test`, `typecheck` и `build` перед ревью.
- Изменение hooks, lint-staged или npm scripts должно обновлять эту карту и `docs/architecture/devops-standards.md`.

## Test VPS deployment contract

- Ветка `main` является источником автодеплоя на VPS `test`-окружения.
- Перед запуском deploy workflow выполняет `git pull --ff-only origin main` на VPS и вызывает версионированный скрипт `scripts/deploy-test-vps.sh`.
- Runtime-конфигурация на VPS передаётся через окружение процесса или внешний env-файл стенда; локальные `backend/.env.local` и `frontend/.env.local` на VPS не используются.
- `test` VPS поднимает backend с `NODE_ENV=test`, `ADMIN_TELEGRAM_ID=<env>` и `DISABLE_TG_AUTH=true`.
- Env-файл стенда должен также содержать `BACKOFFICE_CORS_ORIGINS` с origin опубликованного backoffice; deploy-скрипт проверяет его до рестарта backend.
- `SERVICE_TELEGRAM_BOT_TOKEN` в окружении задаётся только если стенд должен одновременно проверять Telegram auth path; пустое значение не ломает test-mode bypass сценарий.
- Workflow deploy должен уметь выполнить удалённую команду рестарта приложения без предположений о конкретном process manager; конкретная команда хранится в `TEST_DEPLOY_RESTART_COMMAND`.

## Test VPS e2e route

- Финальный feature-level e2e-прогон выполняется против задеплоенного `test` VPS после успешного `Deploy Test` и smoke-check; локальный e2e используется только для разработки или debug.
- DevOps-owned route для `DO-003` предоставляет `scripts/run-test-vps-e2e.sh` и root wrappers `npm run test:vps:e2e:preflight` / `npm run test:vps:e2e` с режимом preflight и запуском QA-owned e2e command against deployed `test`.
- GitHub entrypoint для QA — ручной workflow `Test VPS E2E`, который использует `environment: test`, существующие secrets/vars, SSH на VPS и запускает wrapper в `TEST_VPS_APP_DIR`; он не является `PR Checks` или `Deploy Test` gate.
- Входные параметры route можно задать явно: `TEST_E2E_BACKEND_BASE_URL` для backend base URL `test`, `TEST_E2E_BACKOFFICE_ORIGIN` для опубликованного backoffice origin, `TEST_E2E_TELEGRAM_ID` для test-mode Telegram id.
- При запуске на VPS wrapper также использует существующие deploy/runtime names: `TEST_SMOKE_BACKEND_BASE_URL` или `PORT`/`SERVER_PORT` для backend target, `BACKOFFICE_PUBLIC_URL` или первый `BACKOFFICE_CORS_ORIGINS` для frontend origin, `ADMIN_TELEGRAM_ID` для test-mode id.
- `TEST_E2E_COMMAND` обязателен только для полного запуска QA-owned e2e command.
- Опциональные входные параметры route: `TEST_E2E_ENV_FILE`, `ENV_FILE`, `TEST_E2E_ARTIFACT_DIR`, `TEST_E2E_HEALTH_PATH`, `TEST_E2E_API_PROBE_PATH`, `TEST_E2E_FRONTEND_PATH`, `TEST_E2E_CURL_TIMEOUT`, `TEST_E2E_STAND_COMMIT`, `TEST_E2E_REMOTE_SSH_TARGET`, `TEST_E2E_REMOTE_SSH_PORT`, `TEST_E2E_REMOTE_APP_DIR`.
- Preflight должен подтвердить `GET /health`, test-mode доступ к backoffice API и доступность опубликованного frontend origin до запуска QA-сценариев.
- Pass/fail output должен содержать commit/версию стенда, backend/frontend targets, результат preflight, результат e2e run и пути к `.log` и `.summary.md` артефактам для QA evidence.
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
- `TEST_E2E_BACKEND_BASE_URL` задаёт backend target для DevOps-owned test VPS e2e route.
- `TEST_E2E_BACKOFFICE_ORIGIN` задаёт опубликованный frontend origin для DevOps-owned test VPS e2e route.
- `TEST_E2E_TELEGRAM_ID` задаёт test-mode Telegram id для preflight и QA-owned e2e command на `test`.
- `TEST_E2E_COMMAND` задаёт QA-owned e2e command; не требуется в `--preflight-only`.
- `TEST_E2E_ENV_FILE` или `ENV_FILE` может указывать на env-файл стенда; wrapper source-ит его до вычисления fallback-переменных e2e route.
- `TEST_E2E_ARTIFACT_DIR` задаёт каталог `.log` и `.summary.md` артефактов; по умолчанию `artifacts/test-vps-e2e`.
- `TEST_E2E_STAND_COMMIT` может явно зафиксировать commit/версию стенда для evidence; если не задан, wrapper пробует SSH lookup через `TEST_E2E_REMOTE_SSH_TARGET` и `TEST_E2E_REMOTE_APP_DIR`, затем локальный `git rev-parse HEAD`.

## Backend commands

- Root workspace install: `npm install` в корне репозитория.
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

- Root workspace install: `npm install` в корне репозитория.
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
- Deploy workflow для `main` после выкладки проверяет `GET /health`, test-mode доступ к `GET /backoffice/orders` с заголовком `x-test-telegram-id`, и negative check, подтверждающий, что production-like `DISABLE_TG_AUTH=true` остаётся недопустимым.

## Обновлять эту карту

Карту нужно обновить, если реализация добавляет новые env vars, меняет команды запуска, deployment path, GitHub Actions, smoke-check или test VPS e2e route.
