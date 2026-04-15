# Карта приложения

## Назначение

Этот документ помогает быстро понять, где находится каждый контур приложения, как он запускается, чем он зависит от соседних модулей и какие изменения требуют обновления документации.

## Текущее состояние

- В репозитории уже добавлен первый фактический код для `FEATURE-001`: root `npm workspaces`, `apps/api`, `apps/backoffice-web` и `packages/shared-types`.
- Первая фактическая реализация соответствует срезу `DU-01` из `docs/architecture/du-01/README.md`, а не полному scope всех будущих delivery units.
- Первый рабочий slice `FEATURE-001` должен вводить только `apps/api`, `apps/backoffice-web`, `packages/shared-types`, `infra/` и `.github/workflows`; `apps/backoffice-bot` и `PostgreSQL` остаются частью `DU-01`, но не стартуют в foundation-срезе.
- Для текущего frontend foundation отдельный глобальный state-management layer не обязателен: local state, composables и adapter-layer достаточно для первого smoke-slice.
- Root bootstrap для первого slice зафиксирован в `package.json`, `package-lock.json` и `tsconfig.base.json`.
- Для `FEATURE-001` уже реализованы `infra/feature-001` и `.github/workflows/feature-001-foundation.yml`; они покрывают минимальный runtime, env templates, smoke path и CI-валидацию foundation-среза.
- `FEATURE-002` является первым slice, который обязан включить `apps/backoffice-bot`, `PostgreSQL` / `Prisma`, auth/session shared contracts и production-shaped administrator login path; эти контуры должны стартовать именно здесь, а не откладываться до `FEATURE-003+`.

## Контуры, обязательные для `DU-01`

| Контур | Планируемый путь | Ответственность в `DU-01` | Основные зависимости |
| --- | --- | --- | --- |
| Backend API | `apps/api` | Telegram/test-mode auth session, bootstrap главного administrator, административные read/write контракты меню, пользователей и настроек | `packages/shared-types`, `PostgreSQL`, Telegram init data |
| Backoffice WebApp | `apps/backoffice-web` | Telegram WebApp для administrator, вкладки `Меню`, `Пользователи`, `Настройки`, route guards и typed API adapters | `apps/api`, `packages/shared-types` |
| Backoffice Bot | `apps/backoffice-bot` | Telegram entrypoint для запуска административного WebApp | `apps/api`, Telegram Bot API |
| Shared Types | `packages/shared-types` | Общие DTO, enum и schema fragments для административных контрактов | `apps/api`, `apps/backoffice-web` |
| Infra | `infra/` | Локальный runtime административного среза, env templates, deploy scripts, smoke scripts; для `FEATURE-001` фактически реализован `infra/feature-001` | `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot`, `PostgreSQL` |
| CI/CD | `.github/workflows` | Build, test, image publish, deploy, smoke-check административного среза; foundation-срез уже валидируется workflow `feature-001-foundation.yml` | Все обязательные контуры `DU-01` |

## Контуры, явно отложенные после `DU-01`

| Контур | Планируемый путь | Статус относительно `DU-01` |
| --- | --- | --- |
| Customer WebApp | `apps/customer-web` | Не создаётся в `DU-01`; вводится в customer delivery unit. |
| Customer Bot | `apps/customer-bot` | Не создаётся в `DU-01`; вводится в customer delivery unit. |
| Shared UI | `packages/ui` | Не обязателен в `DU-01`; выделяется позже только при подтверждённой переиспользуемости. |

## Минимальный контур `FEATURE-001`

| Контур | Планируемый путь | Обязателен в `FEATURE-001` | Минимальная ответственность |
| --- | --- | --- | --- |
| Backend foundation | `apps/api` | Да | Поднять `NestJS` runtime, принять config и отдать `GET /api/foundation/health`. |
| Frontend foundation | `apps/backoffice-web` | Да | Поднять минимальный shell по root route `/` и выполнить запрос в backend foundation. |
| Shared foundation contract | `packages/shared-types` | Да | Экспортировать typed DTO ответа foundation endpoint для обеих сторон. |
| Infra foundation | `infra/` | Да | Дать воспроизводимый запуск `api + backoffice-web`, env templates и smoke path `client -> server`. |
| CI validation | `.github/workflows` | Да | Проверять install/test/build foundation-среза без обязательного bot/database runtime. |
| Backoffice Bot | `apps/backoffice-bot` | Нет | Подключается после `FEATURE-001`, когда появляется Telegram entrypoint. |
| PostgreSQL runtime | `infra/` + сервис БД | Нет | Подключается с первой feature, где требуется persistence или bootstrap administrator. |

## Минимальный контур `FEATURE-002`

| Контур | Планируемый путь | Обязателен в `FEATURE-002` | Минимальная ответственность |
| --- | --- | --- | --- |
| Backend auth/session | `apps/api` | Да | Принять Telegram init data или test-mode branch, bootstrap-ить главного administrator, читать role/blocked state и отдавать typed auth/session response. |
| Frontend auth/session shell | `apps/backoffice-web` | Да | Выполнить session bootstrap, включить administrator guard и открыть минимальный backoffice shell без последующих административных capability. |
| Backoffice Bot runtime | `apps/backoffice-bot` | Да | Дать штатный Telegram entrypoint для открытия backoffice WebApp в рабочем режиме. |
| Shared auth contract | `packages/shared-types` | Да | Экспортировать auth/session DTO, enum ролей и error branches для `apps/api` и `apps/backoffice-web`. |
| PostgreSQL / Prisma | `apps/api/prisma` + runtime БД | Да | Хранить пользователя, роль `administrator`, blocked-состояние и bootstrap главного administrator. |
| Infra auth/session | `infra/feature-002` | Да | Дать воспроизводимый запуск `api + backoffice-web + backoffice-bot + postgres`, env templates, migration/bootstrap path и smoke auth/session feature-slice. |
| CI validation | `.github/workflows/feature-002-auth-session.yml` | Да | Проверять `typecheck + test + build + smoke` auth/session-среза с обязательным bot/persistence contour. |

## Внутренняя декомпозиция обязательных контуров

### `apps/api`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/main.ts` | Backend bootstrap: читает `API_PORT` и `API_CORS_ALLOWED_ORIGIN`, создает NestJS app и публикует runtime. |
| `src/app/create-app.ts` | Конфигурирует NestJS application и CORS для foundation runtime. |
| `src/shared/config/runtime-env.ts` | Читает и валидирует `API_PORT`, `API_CORS_ALLOWED_ORIGIN`, а начиная с `FEATURE-002` также `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и `DATABASE_URL`; для local runtime автоматически подхватывает `apps/api/.env.local` и `apps/api/.env`. |
| `src/modules/foundation-runtime` | Foundation endpoint `GET /api/foundation/health` и минимальная логика smoke-ответа. |
| `src/modules/auth-session` | Стартует в `FEATURE-002`: валидация Telegram init data, включение test mode, bootstrap главного administrator и выдача auth/session response для backoffice. |
| `src/modules/identity-access` | Стартует минимально в `FEATURE-002` для user lookup, roles и blocked-state; полные операции назначения ролей и блокировки появляются только в `FEATURE-004`. |
| `src/modules/menu-catalog` | Категории, товары, цены, размеры напитков, группы допов и дополнительные опции. |
| `src/modules/slot-settings` | Рабочие часы и вместимость слотов. |
| `prisma/schema.prisma` | Канонический путь persistence-модели `DU-01`; в `FEATURE-002` здесь должна появиться минимальная схема для пользователя, ролей и blocked-state. |
| `prisma/migrations` | Migration path для `FEATURE-002+`; schema changes вне этого каталога не допускаются без отдельного архитектурного решения. |

### `apps/backoffice-web`

| Фактический модуль / путь | Назначение |
| --- | --- |
| `index.html` | HTML entrypoint Vite-приложения для foundation shell. |
| `src/main.ts` | Frontend bootstrap: инициализация `Vue 3`, `Vue Router` и `Vuetify`. |
| `src/app/router.ts` | Root route `/` для foundation screen без Telegram session и guards. |
| `src/app/plugins` | Инициализация `Vuetify` и других app-level plugins, необходимых для `FEATURE-001`. |
| `src/app/foundation-runtime.smoke.spec.ts` | Smoke-спека, которая запускает frontend foundation layer против живого backend foundation и подтверждает путь `client -> server`. |
| `src/features/foundation-runtime/views/FoundationRuntimeView.vue` | Экран foundation smoke, который отображает состояние запроса `client -> server`. |
| `src/features/foundation-runtime/composables/foundationHealth.ts` | Branching UI-state для загрузки, успеха и ошибки health-check на local reactive state без глобального state-management framework. |
| `src/shared/api/foundationRuntime.ts` | Typed adapter к `GET /api/foundation/health` на базе `packages/shared-types`. |
| `src/shared/config/env.ts` | Чтение и нормализация `VITE_API_BASE_URL`. |
| `src/**/*.spec.ts` | Unit tests и targeted smoke tests для UI-state слоя, frontend foundation layer и API adapter. |

Следующие модули должны стартовать вместе с `FEATURE-002`:

| Планируемый модуль / путь | Назначение |
| --- | --- |
| `src/features/auth-session` | Session bootstrap boundary: обработка Telegram/test-mode входа, UI-ветки ошибки, blocked-state и insufficient-role. |
| `src/features/app-shell` | Минимальный административный shell после входа без реализации `menu/users/settings` capability. |
| `src/shared/api/authSession.ts` | Typed adapter к backend auth/session-контракту на базе `packages/shared-types`. |
| `src/app/router.ts` | После `FEATURE-002` должен содержать administrator guard и блокировать прямой рабочий доступ без валидной серверной сессии. |

Следующие модули пока остаются запланированными и не должны появляться в `FEATURE-002`: `menu-management`, `user-access-management`, `slot-settings`.

### `apps/backoffice-bot`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/main.ts` | Runtime entrypoint процесса Telegram backoffice-бота. |
| `src/launch-entry` | Telegram-команда/entrypoint, открывающая backoffice WebApp и не содержащая бариста-напоминаний или другой логики вне `FEATURE-002`. |

### `packages/shared-types`

| Фактический пакетный срез | Назначение |
| --- | --- |
| `src/lib/foundation-runtime.ts` | `FoundationHealthResponse` и runtime type guard для smoke-контракта `GET /api/foundation/health`. |
| `src/index.ts` | Публичный entrypoint shared foundation DTO. |
| `package.json` / `tsconfig.json` | Workspace package bootstrap и build-конфигурация shared types. |

Следующие пакетные срезы должны стартовать вместе с `FEATURE-002`:

| Планируемый пакетный срез | Назначение |
| --- | --- |
| `src/lib/auth-session.ts` | Request-response DTO и enum для auth/session bootstrap, administrator session state и error branches. |

Следующие пакетные срезы пока только запланированы и не входят в `FEATURE-002`: `menu-catalog`, `user-role-blocking`, `slot-settings`.

## Точки входа и маршруты

- `apps/backoffice-web`: фактический entrypoint находится в `apps/backoffice-web/src/main.ts`; для `FEATURE-001` root route `/` из `src/app/router.ts` временно используется как direct URL foundation entrypoint в `local`/`test` runtime.
- `apps/backoffice-web`: начиная с `FEATURE-002` root route `/` становится boundary для server-backed session bootstrap; прямой рабочий URL без Telegram допустим только при `DISABLE_TG_AUTH=true`.
- `apps/backoffice-bot`: `FEATURE-002` должен ввести `apps/backoffice-bot/src/main.ts` как Telegram runtime entrypoint для открытия WebApp.
- `apps/api`: фактический backend entrypoint находится в `apps/api/src/main.ts`; в `FEATURE-001` обязателен только foundation endpoint `GET /api/foundation/health`, а в `FEATURE-002` добавляется auth/session boundary и persistence bootstrap.
- `apps/api/prisma/schema.prisma` и `apps/api/prisma/migrations`: planned persistence entrypoints для `FEATURE-002`.
- `apps/api/.env.example`: шаблон локальной конфигурации foundation runtime; фактический local override читается из `apps/api/.env.local`.
- `apps/backoffice-web/.env.example`: шаблон frontend-конфигурации foundation runtime; фактический local override читается из `apps/backoffice-web/.env.local`.
- `infra/feature-001/README.md`: точка входа в минимальный runtime foundation, env templates и сценарии `dev/smoke/verify`.
- `infra/feature-001/scripts/*.mjs`: воспроизводимый запуск `api + backoffice-web` и smoke-маршрут foundation-среза.
- `infra/feature-002/README.md` и `infra/feature-002/scripts/*.mjs`: обязательный planned entrypoint для auth/session runtime, migrations/bootstrap path и smoke-маршрута `FEATURE-002`.
- `.github/workflows/feature-001-foundation.yml`: CI entrypoint для `typecheck + test + build + smoke` по `FEATURE-001`.
- `.github/workflows/feature-002-auth-session.yml`: planned CI entrypoint для `FEATURE-002` с обязательными проверками bot/runtime и persistence.
- `packages/shared-types`: фактический build-time entrypoint находится в `packages/shared-types/src/index.ts`; пакет экспортирует shared foundation DTO и последующие административные контракты.
- `apps/customer-web` и `apps/customer-bot` не являются точками входа `DU-01` и не должны появляться в child-задачах этой delivery unit.

## Зафиксированные ограничения по scope `DU-01`

- В `DU-01` не реализуются вкладки `orders` и `availability`, даже если они есть в общем backoffice UI-contract; эти вкладки относятся к `DU-03`.
- В `DU-01` не реализуются `unblock_user`, product image upload, real-time order indicators и другие элементы UI-контракта, для которых нет канонического бизнес-/system-подтверждения.
- Спор о том, кто может назначать новых `administrator`, должен быть локализован в backend policy/module и не должен размазываться по нескольким контурам.

## Где запускать и проверять

- Установка workspace-зависимостей выполняется из корня командой `npm install`.
- Для `FEATURE-001` первым воспроизводимым маршрутом запуска считается только связка `apps/api + apps/backoffice-web`; подключение `apps/backoffice-bot` и `PostgreSQL` начинается в следующих фичах.
- Для `FEATURE-002` обязательным маршрутом запуска становится связка `apps/api + apps/backoffice-web + apps/backoffice-bot + PostgreSQL`; отсутствие `backoffice-bot` или persistence больше не является допустимым упрощением фичи.
- После реализации `DO-002` корневые scripts должны экспонировать отдельные команды `dev:feature-002`, `smoke:feature-002` и `verify:feature-002`; использовать foundation-команды `FEATURE-001` для auth/session slice недостаточно.
- Для текущего frontend foundation уже доступны команды:
  - `npm run dev`
  - `npm run dev:feature-001`
  - `npm run smoke:feature-001`
  - `npm run verify:feature-001`
  - `npm run dev:api`
  - `npm run dev:backoffice-web`
  - `npm run test:api`
  - `npm run typecheck:api`
  - `npm run build:api`
  - `npm run test:backoffice-web`
  - `npm run typecheck:backoffice-web`
  - `npm run build:shared-types`
  - `npm run build:backoffice-web`
  - `npm run build:feature-001`
- `FEATURE-002` должен расширить этот маршрут новыми env/config и scripts: `apps/api` читает `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и `DATABASE_URL`, `apps/backoffice-web` продолжает использовать `VITE_API_BASE_URL`, а `apps/backoffice-bot` требует `TG_BACKOFFICE_BOT_TOKEN`.
- Для lightweight `test` smoke `FEATURE-002` разрешён test-mode branch через `DISABLE_TG_AUTH=true`, но он обязан использовать тот же backend auth/session path, что и штатный Telegram вход.
- Deployment path и environment-specific маршруты читаются из `deployment-map.md`.

## Когда обновлять карту

- Появился новый каталог верхнего уровня или новый runtime contour.
- Изменился entrypoint, способ запуска, путь к тестам или путь к deployment-артефакту.
- Появился новый shared package, новый внешний dependency edge или новый интеграционный модуль.
- Изменились env vars, которые важны для запуска, тестирования или деплоя.
