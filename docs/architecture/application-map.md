# Карта приложения

## Назначение

Этот документ помогает быстро понять, где находится каждый контур приложения, как он запускается, чем он зависит от соседних модулей и какие изменения требуют обновления документации.

## Текущее состояние

- В репозитории уже добавлен первый фактический код для `FEATURE-001`: root `npm workspaces`, `apps/api`, `apps/backoffice-web` и `packages/shared-types`.
- Первая фактическая реализация соответствует срезу `DU-01` из `du-01-administration.md`, а не полному scope всех будущих delivery units.
- Первый рабочий slice `FEATURE-001` должен вводить только `apps/api`, `apps/backoffice-web`, `packages/shared-types`, `infra/` и `.github/workflows`; `apps/backoffice-bot` и `PostgreSQL` остаются частью `DU-01`, но не стартуют в foundation-срезе.
- Для текущего frontend foundation отдельный глобальный state-management layer не обязателен: local state, composables и adapter-layer достаточно для первого smoke-slice.
- Root bootstrap для первого slice зафиксирован в `package.json`, `package-lock.json` и `tsconfig.base.json`.
- `infra/` и `.github/workflows` для полного `FEATURE-001` ещё не реализованы и должны появиться в соответствующих `DO-*` задачах.

## Контуры, обязательные для `DU-01`

| Контур | Планируемый путь | Ответственность в `DU-01` | Основные зависимости |
| --- | --- | --- | --- |
| Backend API | `apps/api` | Telegram/test-mode auth session, bootstrap главного administrator, административные read/write контракты меню, пользователей и настроек | `packages/shared-types`, `PostgreSQL`, Telegram init data |
| Backoffice WebApp | `apps/backoffice-web` | Telegram WebApp для administrator, вкладки `Меню`, `Пользователи`, `Настройки`, route guards и typed API adapters | `apps/api`, `packages/shared-types` |
| Backoffice Bot | `apps/backoffice-bot` | Telegram entrypoint для запуска административного WebApp | `apps/api`, Telegram Bot API |
| Shared Types | `packages/shared-types` | Общие DTO, enum и schema fragments для административных контрактов | `apps/api`, `apps/backoffice-web` |
| Infra | `infra/` | Локальный runtime административного среза, env templates, deploy scripts, smoke scripts | `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot`, `PostgreSQL` |
| CI/CD | `.github/workflows` | Build, test, image publish, deploy, smoke-check административного среза | Все обязательные контуры `DU-01` |

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

## Внутренняя декомпозиция обязательных контуров

### `apps/api`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/main.ts` | Backend bootstrap: читает `API_PORT` и `API_CORS_ALLOWED_ORIGIN`, создает NestJS app и публикует runtime. |
| `src/app/create-app.ts` | Конфигурирует NestJS application и CORS для foundation runtime. |
| `src/shared/config/runtime-env.ts` | Читает и валидирует `API_PORT` и `API_CORS_ALLOWED_ORIGIN`, а для local runtime автоматически подхватывает `apps/api/.env.local` и `apps/api/.env`. |
| `src/modules/foundation-runtime` | Foundation endpoint `GET /api/foundation/health` и минимальная логика smoke-ответа. |
| `src/modules/auth-session` | Валидация Telegram init data, включение test mode, bootstrap главного administrator. |
| `src/modules/identity-access` | Пользователи, назначение ролей, блокировка, policy по полномочиям administrator. |
| `src/modules/menu-catalog` | Категории, товары, цены, размеры напитков, группы допов и дополнительные опции. |
| `src/modules/slot-settings` | Рабочие часы и вместимость слотов. |

### `apps/backoffice-web`

| Фактический модуль / путь | Назначение |
| --- | --- |
| `index.html` | HTML entrypoint Vite-приложения для foundation shell. |
| `src/main.ts` | Frontend bootstrap: инициализация `Vue 3`, `Vue Router` и `Vuetify`. |
| `src/app/router.ts` | Root route `/` для foundation screen без Telegram session и guards. |
| `src/app/plugins` | Инициализация `Vuetify` и других app-level plugins, необходимых для `FEATURE-001`. |
| `src/features/foundation-runtime/views/FoundationRuntimeView.vue` | Экран foundation smoke, который отображает состояние запроса `client -> server`. |
| `src/features/foundation-runtime/composables/foundationHealth.ts` | Branching UI-state для загрузки, успеха и ошибки health-check на local reactive state без глобального state-management framework. |
| `src/shared/api/foundationRuntime.ts` | Typed adapter к `GET /api/foundation/health` на базе `packages/shared-types`. |
| `src/shared/config/env.ts` | Чтение и нормализация `VITE_API_BASE_URL`. |
| `src/**/*.spec.ts` | Unit tests для UI-state слоя и API adapter. |

Следующие модули пока остаются запланированными и не должны появляться в `FE-001`: `menu-management`, `user-access-management`, `slot-settings`, session bootstrap и role guards.

### `apps/backoffice-bot`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/launch-entry` | Telegram-команда/entrypoint, открывающая backoffice WebApp. |

### `packages/shared-types`

| Фактический пакетный срез | Назначение |
| --- | --- |
| `src/lib/foundation-runtime.ts` | `FoundationHealthResponse` и runtime type guard для smoke-контракта `GET /api/foundation/health`. |
| `src/index.ts` | Публичный entrypoint shared foundation DTO. |
| `package.json` / `tsconfig.json` | Workspace package bootstrap и build-конфигурация shared types. |

Следующие пакетные срезы пока только запланированы и не входят в `FEATURE-001`: `auth-session`, `menu-catalog`, `user-role-blocking`, `slot-settings`.

## Точки входа и маршруты

- `apps/backoffice-web`: фактический entrypoint находится в `apps/backoffice-web/src/main.ts`; для `FEATURE-001` root route `/` из `src/app/router.ts` временно используется как direct URL foundation entrypoint в `local`/`test` runtime.
- `apps/backoffice-bot`: Telegram backoffice bot webhook/polling entrypoint для открытия WebApp.
- `apps/api`: фактический backend entrypoint находится в `apps/api/src/main.ts`; в `FEATURE-001` обязателен только foundation endpoint `GET /api/foundation/health`.
- `apps/api/.env.example`: шаблон локальной конфигурации foundation runtime; фактический local override читается из `apps/api/.env.local`.
- `packages/shared-types`: фактический build-time entrypoint находится в `packages/shared-types/src/index.ts`; пакет экспортирует shared foundation DTO и последующие административные контракты.
- `apps/customer-web` и `apps/customer-bot` не являются точками входа `DU-01` и не должны появляться в child-задачах этой delivery unit.

## Зафиксированные ограничения по scope `DU-01`

- В `DU-01` не реализуются вкладки `orders` и `availability`, даже если они есть в общем backoffice UI-contract; эти вкладки относятся к `DU-03`.
- В `DU-01` не реализуются `unblock_user`, product image upload, real-time order indicators и другие элементы UI-контракта, для которых нет канонического бизнес-/system-подтверждения.
- Спор о том, кто может назначать новых `administrator`, должен быть локализован в backend policy/module и не должен размазываться по нескольким контурам.

## Где запускать и проверять

- Установка workspace-зависимостей выполняется из корня командой `npm install`.
- Для `FEATURE-001` первым воспроизводимым маршрутом запуска считается только связка `apps/api + apps/backoffice-web`; подключение `apps/backoffice-bot` и `PostgreSQL` начинается в следующих фичах.
- Для текущего frontend foundation уже доступны команды:
  - `npm run dev:api`
  - `npm run dev`
  - `npm run dev:backoffice-web`
  - `npm run test:api`
  - `npm run dev -w @expressa/backoffice-web`
  - `npm run typecheck:api`
  - `npm run build:api`
  - `npm run test:backoffice-web`
  - `npm run typecheck:backoffice-web`
  - `npm run build:shared-types`
  - `npm run build:backoffice-web`
- `apps/api` читает `API_PORT` и `API_CORS_ALLOWED_ORIGIN`; для local runtime backend сначала подхватывает `apps/api/.env.local`, затем `apps/api/.env`, а `process.env` остаётся приоритетным источником. `apps/backoffice-web` читает `VITE_API_BASE_URL` и ожидает backend foundation endpoint `GET /api/foundation/health`.
- Deployment path и environment-specific маршруты читаются из `deployment-map.md`.

## Когда обновлять карту

- Появился новый каталог верхнего уровня или новый runtime contour.
- Изменился entrypoint, способ запуска, путь к тестам или путь к deployment-артефакту.
- Появился новый shared package, новый внешний dependency edge или новый интеграционный модуль.
- Изменились env vars, которые важны для запуска, тестирования или деплоя.
