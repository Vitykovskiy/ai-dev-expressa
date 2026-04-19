# Delivery And Runtime Application Map

## Граница

Runtime configuration, deployment safety и smoke-check для входа administrator в backoffice.

## Окружения

| Environment | Telegram auth | Test-mode bypass |
|---|---|---|
| `production` | Обязательна | Запрещён |
| `test` | Допустима | Разрешён только при `DISABLE_TG_AUTH=true` |
| local development | Определяется проектной конфигурацией | Не должен маскировать production ограничения |

## Branch policy and pipeline

- Pull request в `main` запускает только обязательные проверки `quality` и `build`; PR workflow не выполняет deploy.
- Job `quality` обязан проверять `backend` и `frontend` lint, format:check, typecheck, unit tests и связанные статические проверки; для `frontend` дополнительно обязателен stylelint.
- Job `build` обязан независимо подтверждать сборку `backend` и `frontend`.
- Обязательные gates не должны работать в warning-only режиме: ошибка любой команды блокирует готовность запроса на слияние.
- Push/merge в `main` запускает `Deploy Test` workflow и деплоит только `test`-окружение на VPS.
- Secrets для SSH-доступа к VPS и удалённой restart-команды хранятся в GitHub Secrets.
- Runtime переменные приложения хранятся в корневом `.env` на VPS и не коммитятся в репозиторий.

## Local quality hooks

- Pre-commit hook запускает `lint-staged` на изменённых файлах.
- `lint-staged` должен применять formatting/lint к backend и frontend TypeScript/Vue файлам и stylelint к изменённым frontend style blocks или style files, где применимо.
- Hooks являются быстрым локальным gate и не заменяют полные `test`, `typecheck` и `build` перед ревью.
- Изменение hooks, lint-staged или npm scripts должно обновлять эту карту и `docs/architecture/devops-standards.md`.

## Test VPS deployment contract

- Ветка `main` является источником автодеплоя на VPS `test`-окружения.
- Перед запуском deploy workflow выполняет `git pull --ff-only origin main` на VPS и вызывает версионированный скрипт `scripts/deploy-test-vps.sh`.
- Корневой `.env` на VPS является источником runtime-конфигурации для backend и frontend build.
- `test` VPS поднимает backend с `NODE_ENV=test`, `ADMIN_TELEGRAM_ID=<root .env>` и `DISABLE_TG_AUTH=true`.
- `SERVICE_TELEGRAM_BOT_TOKEN` в `.env` задаётся только если стенд должен одновременно проверять Telegram auth path; пустое значение не ломает test-mode bypass сценарий.
- Workflow deploy должен уметь выполнить удалённую команду рестарта приложения без предположений о конкретном process manager; конкретная команда хранится в `TEST_DEPLOY_RESTART_COMMAND`.

## Env vars

- `ADMIN_TELEGRAM_ID` должен быть задан до запуска backend.
- `DISABLE_TG_AUTH=true` допустим только для test environment.
- `SERVICE_TELEGRAM_BOT_TOKEN` должен быть задан при включённой Telegram auth.
- Секрет служебного Telegram-бота должен передаваться через секреты окружения, а не через исходный код.
- `NODE_ENV=test` обязателен для test VPS.
- `PORT` определяет локальный порт backend для smoke-check; по умолчанию используется `3000`.
- `VITE_BACKOFFICE_API_BASE_URL` может быть определён в корневом `.env` и попадает во frontend build через экспорт окружения во время deploy.

## Backend commands

- Установка: `cd backend && npm install`.
- Lint: `cd backend && npm run lint`.
- Format check: `cd backend && npm run format:check`.
- Сборка: `cd backend && npm run build`.
- Typecheck: `cd backend && npm run typecheck`.
- Тесты: `cd backend && npm test`.
- Production-like запуск после сборки: `cd backend && NODE_ENV=production ADMIN_TELEGRAM_ID=<id> SERVICE_TELEGRAM_BOT_TOKEN=<token> npm start`.
- Test-mode без Telegram: `cd backend && NODE_ENV=test ADMIN_TELEGRAM_ID=<id> DISABLE_TG_AUTH=true npm start`.

## Frontend commands

- Установка: `cd frontend && npm install`.
- Lint: `cd frontend && npm run lint`.
- Stylelint: `cd frontend && npm run stylelint`.
- Format check: `cd frontend && npm run format:check`.
- Сборка: `cd frontend && npm run build`.
- Typecheck: `cd frontend && npm run typecheck`.
- Тесты: `cd frontend && npm test`.

## Smoke-check

- Backend стартует и выполняет идемпотентный bootstrap administrator.
- Production-like запуск с `DISABLE_TG_AUTH=true` завершается ошибкой конфигурации или блокирует bypass.
- Backoffice без Telegram-входа в production-like режиме не открывает рабочие вкладки.
- Test environment с `DISABLE_TG_AUTH=true` позволяет выполнить проверку role guard без Telegram.
- PR workflow `quality` успешно завершает `backend/frontend` lint, format:check, typecheck и unit tests, а также frontend stylelint.
- PR workflow `build` успешно завершает сборку `backend/frontend`.
- Deploy workflow для `main` после выкладки проверяет `GET /health`, test-mode доступ к `GET /backoffice/orders` с заголовком `x-test-telegram-id`, и negative check, подтверждающий, что production-like `DISABLE_TG_AUTH=true` остаётся недопустимым.

## Обновлять эту карту

Карту нужно обновить, если реализация добавляет новые env vars, меняет команды запуска, deployment path, GitHub Actions или smoke-check.
