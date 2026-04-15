# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка и ручная проверка child-задач | для `FEATURE-001`: локальный запуск `api + backoffice-web`, unit tests и smoke `client -> server`; для `FEATURE-002+`: production-shaped локальный запуск `api + backoffice-web + backoffice-bot + postgres` |
| `test` | Lightweight runtime для foundation- и feature-smoke без полного production-shaped контура | для `FEATURE-001`: запуск `api + backoffice-web`; для `FEATURE-002`: auth/session smoke через backend test-mode branch при `DISABLE_TG_AUTH=true`, но с тем же persistence и session-контрактом, что и в рабочем runtime |
| `ci` | Проверка pull request и merge readiness | install, typecheck, unit tests, build и smoke административного среза |
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

## Минимальный runtime для `FEATURE-002`

- `apps/api`
- `apps/backoffice-web`
- `apps/backoffice-bot`
- `PostgreSQL`
- `packages/shared-types` как build-time и contract-sync зависимость между `client` и `server`
- `apps/api/prisma/schema.prisma` и `apps/api/prisma/migrations` как обязательный persistence path
- `infra/feature-002` как носитель env templates, startup scripts, migration/bootstrap scripts и smoke-маршрута auth/session-среза
- В lightweight `test` runtime допустим branch без живой Telegram-авторизации через `DISABLE_TG_AUTH=true`, но это не убирает `backoffice-bot` из обязательного feature scope и не заменяет production-shaped local/staging runtime

## CI/CD-поток

- `pull request pipeline`
  - install dependencies
  - run lint
  - run unit tests по затронутым контурам; для `FEATURE-001` обязательны `apps/api`, `apps/backoffice-web`, `packages/shared-types`
  - run build для `apps/api` и `apps/backoffice-web`; начиная с `FEATURE-002` `apps/backoffice-bot` становится обязательным build job
- `main/release pipeline`
  - build runtime artifacts затронутого среза
  - publish container images для обязательных runtime-контуров текущего feature-slice; для `FEATURE-001` достаточно `api` и `backoffice-web`, для `FEATURE-002` обязательны `api`, `backoffice-web` и `backoffice-bot`
  - apply schema/migration changes обязательно начиная с `FEATURE-002`, где впервые появляется `PostgreSQL`/Prisma runtime
  - deploy target environment
  - execute smoke-check затронутого outcome (`FEATURE-001` или полный `DU-01`)

## Базовые env vars `FEATURE-001`

- `API_PORT`
- `API_CORS_ALLOWED_ORIGIN`
- `VITE_API_BASE_URL`

Для local runtime foundation:

- `apps/api/.env.example` задаёт шаблон backend-конфига;
- `apps/backoffice-web/.env.example` задаёт шаблон frontend-конфига;
- `infra/feature-001/env/api.env.example` и `infra/feature-001/env/backoffice-web.env.example` фиксируют минимальные значения foundation runtime;
- `apps/api/.env.local` используется как локальный override для `API_PORT` и `API_CORS_ALLOWED_ORIGIN`;
- `apps/backoffice-web/.env.local` используется как локальный override для `VITE_API_BASE_URL`;
- значения из `process.env` имеют приоритет над файлами.

## Базовые env vars `FEATURE-002`

- `API_PORT`
- `API_CORS_ALLOWED_ORIGIN`
- `VITE_API_BASE_URL`
- `ADMIN_TELEGRAM_ID`
- `DISABLE_TG_AUTH`
- `DATABASE_URL`
- `TG_BACKOFFICE_BOT_TOKEN`

Для local/test runtime auth-session:

- `apps/api/.env.example` должен быть расширен до auth/session и persistence-конфига;
- `apps/backoffice-web/.env.example` остаётся шаблоном frontend-конфига и продолжает указывать на `apps/api`;
- `apps/backoffice-bot/.env.example` должен появиться вместе с `FEATURE-002` и фиксировать bot runtime;
- `infra/feature-002/env/*.env.example` должны описывать согласованный набор переменных для `api`, `backoffice-web`, `backoffice-bot` и `postgres`;
- значения из `process.env` сохраняют приоритет над файлами;
- если для запуска bot/WebApp потребуется отдельная deployment-specific переменная сверх перечисленных выше, она должна быть добавлена в этот документ в той же задаче, где вводится.

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
  - foundation smoke воспроизводится командами `npm run smoke:feature-001` локально и workflow `.github/workflows/feature-001-foundation.yml` в CI;
  - smoke выполняется без `backoffice-bot`, Telegram auth/session и `PostgreSQL`.
- Для `FEATURE-002` smoke-check обязан подтвердить:
  - применён persistence path `Prisma` / schema migrations для user/session слоя;
  - backend идемпотентно bootstrap-ит главного administrator из `ADMIN_TELEGRAM_ID`;
  - administrator проходит вход через `Telegram backoffice-бота` или через test mode при `DISABLE_TG_AUTH=true`;
  - backend auth/session contract возвращает typed административную сессию и отклоняет blocked/non-administrator доступ;
  - `apps/backoffice-web` открывает минимальный administrator shell после успешного bootstrap;
  - smoke воспроизводится отдельными маршрутами `FEATURE-002`, а не foundation-smoke `FEATURE-001`.
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
