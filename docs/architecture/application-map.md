# Карта приложения

## Назначение

Этот документ помогает быстро понять, где находится каждый контур приложения, как он запускается, чем он зависит от соседних модулей и какие изменения требуют обновления документации.

## Текущее состояние

- В репозитории реализован backend-срез `DU-01`: `apps/api` и `packages/shared-types`.
- `apps/backoffice-web`, `apps/backoffice-bot`, `infra/` и `.github/workflows` остаются обязательными контурами `DU-01`, но ещё не добавлены в репозиторий в рамках `BE-001`.
- Backend запускается как `NestJS`-приложение с переключаемым persistence driver: `prisma` для `PostgreSQL` и `memory` для smoke/unit сценариев.

## Контуры, обязательные для `DU-01`

| Контур | Фактический статус / путь | Ответственность в `DU-01` | Основные зависимости |
| --- | --- | --- | --- |
| Backend API | Реализован: `apps/api` | Telegram/test-mode auth session, bootstrap главного administrator, административные read/write контракты меню, пользователей и настроек | `packages/shared-types`, `Prisma`, `PostgreSQL`, Telegram init data |
| Backoffice WebApp | Планируется: `apps/backoffice-web` | Telegram WebApp для administrator, вкладки `Меню`, `Пользователи`, `Настройки`, route guards и typed API adapters | `apps/api`, `packages/shared-types` |
| Backoffice Bot | Планируется: `apps/backoffice-bot` | Telegram entrypoint для запуска административного WebApp | `apps/api`, Telegram Bot API |
| Shared Types | Реализован: `packages/shared-types` | Общие DTO, enum для административных контрактов `auth-session`, `user-role-blocking`, `menu-catalog`, `slot-settings` | `apps/api`, `apps/backoffice-web` |
| Infra | Планируется: `infra/` | Локальный runtime административного среза, env templates, deploy scripts, smoke scripts | `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot`, `PostgreSQL` |
| CI/CD | Планируется: `.github/workflows` | Build, test, image publish, deploy, smoke-check административного среза | Все обязательные контуры `DU-01` |

## Контуры, явно отложенные после `DU-01`

| Контур | Планируемый путь | Статус относительно `DU-01` |
| --- | --- | --- |
| Customer WebApp | `apps/customer-web` | Не создаётся в `DU-01`; вводится в customer delivery unit. |
| Customer Bot | `apps/customer-bot` | Не создаётся в `DU-01`; вводится в customer delivery unit. |
| Shared UI | `packages/ui` | Не обязателен в `DU-01`; выделяется позже только при подтверждённой переиспользуемости. |

## Внутренняя декомпозиция обязательных контуров

### `apps/api`

| Фактический модуль | Назначение |
| --- | --- |
| `src/modules/auth-session` | Валидация Telegram init data или test-mode header, bootstrap главного administrator, session DTO. |
| `src/modules/identity-access` | Список пользователей, назначение ролей, блокировка, policy `ADMINISTRATOR_PROMOTION_MODE`. |
| `src/modules/menu-catalog` | Чтение и сохранение административного каталога меню с validator/mapper/service слоями. |
| `src/modules/slot-settings` | Чтение дефолтных и сохранение административных настроек слотов. |
| `src/modules/persistence` | In-memory и Prisma adapters для пользователей, каталога и slot settings. |
| `prisma/schema.prisma` | PostgreSQL schema для users, menu catalog snapshot и slot settings snapshot. |
| `test/unit`, `test/smoke` | Unit tests для policy/service/validator/mapper и интеграционный smoke `DU-01`. |

### `apps/backoffice-web`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/app` | Session bootstrap, router, layout, guards и навигация administrator. |
| `src/features/menu-management` | UI и state management для управления меню. |
| `src/features/user-access-management` | UI и state management для пользователей, ролей и блокировки. |
| `src/features/slot-settings` | UI и state management для рабочих часов и вместимости. |
| `src/shared/api` | Typed API-клиенты и адаптеры на базе `packages/shared-types`. |

### `apps/backoffice-bot`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/launch-entry` | Telegram-команда/entrypoint, открывающая backoffice WebApp. |

### `packages/shared-types`

| Фактический пакетный срез | Назначение |
| --- | --- |
| `auth-session` | Session bootstrap и информация о текущем пользователе/ролях. |
| `menu-catalog` | DTO для административного чтения и изменения меню. |
| `user-role-blocking` | DTO для списка пользователей, смены ролей и блокировки. |
| `slot-settings` | DTO для чтения и сохранения рабочих часов и вместимости. |

## Точки входа и маршруты

- `apps/api/src/main.ts`: основной backend runtime административного контура, стартует `NestJS` c global prefix `api`.
- `GET /api/auth/session`: bootstrap/auth session для administrator; test mode использует заголовок `x-test-telegram-id`, production path принимает `Authorization: tma <initData>` или `x-telegram-init-data`.
- `GET /api/users`, `POST /api/users/roles`, `POST /api/users/block`: административное управление пользователями и ролями.
- `GET /api/menu`, `PUT /api/menu`: административное чтение и сохранение каталога меню.
- `GET /api/slot-settings`, `PUT /api/slot-settings`: чтение и сохранение рабочих часов и вместимости слотов.
- `apps/backoffice-web`: entrypoint административного Telegram WebApp; прямой рабочий доступ по URL не считается штатным сценарием.
- `apps/backoffice-bot`: Telegram backoffice bot webhook/polling entrypoint для открытия WebApp.
- `apps/customer-web` и `apps/customer-bot` не являются точками входа `DU-01` и не должны появляться в child-задачах этой delivery unit.

## Зафиксированные ограничения по scope `DU-01`

- В `DU-01` не реализуются вкладки `orders` и `availability`, даже если они есть в общем backoffice UI-contract; эти вкладки относятся к `DU-03`.
- В `DU-01` не реализуются `unblock_user`, product image upload, real-time order indicators и другие элементы UI-контракта, для которых нет канонического бизнес-/system-подтверждения.
- Спор о том, кто может назначать новых `administrator`, должен быть локализован в backend policy/module и не должен размазываться по нескольким контурам.

## Где запускать и проверять

- Установка зависимостей: `pnpm install`.
- Генерация Prisma client: `pnpm prisma:generate`.
- Сборка backend slice: `pnpm build`.
- Unit + smoke проверки backend slice: `pnpm test`.
- Локальный запуск API: `pnpm --filter @expressa/api start`.
- Для smoke/unit сценариев backend использует `PERSISTENCE_DRIVER=memory`; для runtime с `PostgreSQL` требуется `PERSISTENCE_DRIVER=prisma` и валидный `DATABASE_URL`.
- Deployment path и environment-specific маршруты читаются из `deployment-map.md`.

## Когда обновлять карту

- Появился новый каталог верхнего уровня или новый runtime contour.
- Изменился entrypoint, способ запуска, путь к тестам или путь к deployment-артефакту.
- Появился новый shared package, новый внешний dependency edge или новый интеграционный модуль.
- Изменились env vars, которые важны для запуска, тестирования или деплоя.
