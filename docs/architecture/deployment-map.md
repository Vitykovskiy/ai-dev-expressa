# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка и ручная проверка child-задач | для `FEATURE-001`: локальный запуск `api + backoffice-web`, unit tests и smoke `client -> server`; для полного `DU-01`: `api + backoffice-web + backoffice-bot + postgres` |
| `test` | Lightweight runtime для foundation- и feature-smoke без полного production-shaped контура | deploy или запуск `api + backoffice-web`, проверка env/config feature-среза и smoke `client -> server` |
| `ci` | Проверка pull request и merge readiness | install, lint, unit tests, build административного среза |
| `staging` | Проверка интеграции перед выпуском | deploy административного среза, smoke-check сценария administrator, проверка env/config |
| `production` | Боевой выпуск | controlled deploy административного среза, post-deploy smoke-check, rollback path |

## Состав runtime для `DU-01`

- `PostgreSQL`
- `apps/api`
- `apps/backoffice-web`
- `apps/backoffice-bot`
- `apps/customer-web` и `apps/customer-bot` не входят в runtime `DU-01`.

## Минимальный runtime для `FEATURE-001`

- `apps/api`
- `apps/backoffice-web`
- `packages/shared-types` как build-time зависимость между `client` и `server`
- `infra/` как носитель env templates, startup scripts и smoke-маршрута
- `apps/backoffice-bot`, `PostgreSQL`, Prisma migrations и Telegram auth/session не входят в runtime `FEATURE-001`

## CI/CD-поток

- `pull request pipeline`
  - install dependencies
  - run lint
  - run unit tests по затронутым контурам; для `FEATURE-001` обязательны `apps/api`, `apps/backoffice-web`, `packages/shared-types`
  - run build для `apps/api` и `apps/backoffice-web`; `apps/backoffice-bot` подключается к обязательным build jobs после появления самой feature с Telegram entrypoint
- `main/release pipeline`
  - build runtime artifacts затронутого среза
  - publish container images для обязательных runtime-контуров текущего feature-slice; для `FEATURE-001` достаточно `api` и `backoffice-web`
  - apply schema/migration changes только если feature реально вводит `PostgreSQL`/Prisma runtime
  - deploy target environment
  - execute smoke-check затронутого outcome (`FEATURE-001` или полный `DU-01`)

## Базовые env vars `FEATURE-001`

- `API_PORT`
- `API_CORS_ALLOWED_ORIGIN`
- `VITE_API_BASE_URL`

## Базовые env vars полного `DU-01`

- `ADMIN_TELEGRAM_ID`
- `DISABLE_TG_AUTH`
- `DATABASE_URL`
- `TG_BACKOFFICE_BOT_TOKEN`

Отложенные переменные вне `DU-01`:

- `TG_CUSTOMER_BOT_TOKEN`

Каждая новая переменная окружения должна быть описана здесь вместе с контуром, где она используется.

## Smoke-check и rollback

- Каждый deploy должен иметь зафиксированный smoke-сценарий для затронутой delivery unit.
- Для `FEATURE-001` smoke-check обязан подтвердить:
  - `apps/api` отвечает `200 OK` на `GET /api/foundation/health`;
  - ответ `apps/api` имеет форму `{ status: 'ok', service: 'api' }`;
  - `apps/backoffice-web` с `VITE_API_BASE_URL`, указывающим на `apps/api`, получает этот ответ и отображает успешный статус;
  - smoke выполняется без `backoffice-bot`, Telegram auth/session и `PostgreSQL`.
- Для `DU-01` smoke-check обязан подтвердить:
  - bootstrap главного administrator из `ADMIN_TELEGRAM_ID`;
  - вход в backoffice через `Telegram backoffice-бота` или test mode при `DISABLE_TG_AUTH=true`;
  - сохранение изменений меню;
  - сохранение рабочих часов и вместимости слотов;
  - назначение роли и блокировку пользователя.
- Каждый deploy должен иметь документированный rollback или restore path.
- Если изменение затрагивает migration или несовместимый контракт, rollback strategy должна быть описана до начала реализации.

## Правила актуализации

- Обновляйте документ при изменении pipeline stages, deploy targets, env vars, secrets handling, smoke-check или rollback process.
- Если из этого документа уже нельзя восстановить путь от merge до проверенного deployment, документ устарел и должен быть обновлен в той же задаче.
