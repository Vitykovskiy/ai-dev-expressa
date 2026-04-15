# Карта приложения

## Назначение

Этот документ помогает быстро понять, где находится каждый контур приложения, как он запускается, чем он зависит от соседних модулей и какие изменения требуют обновления документации.

## Текущее состояние

- На текущем этапе прикладной код еще не добавлен в репозиторий.
- Эта карта фиксирует целевую структуру, по которой должны создаваться первые модули и каталоги.
- Первая фактическая реализация в репозитории должна соответствовать срезу `DU-01` из `du-01-administration.md`, а не полному scope всех будущих delivery units.
- Первый рабочий slice `FEATURE-001` должен вводить только `apps/api`, `apps/backoffice-web`, `packages/shared-types`, `infra/` и `.github/workflows`; `apps/backoffice-bot` и `PostgreSQL` остаются частью `DU-01`, но не стартуют в foundation-срезе.
- Первый разработчик, который создаёт новый реальный каталог из карты, должен актуализировать этот документ по фактическим путям.

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
| `src/modules/foundation-runtime` | Foundation endpoint `GET /api/foundation/health`, config bootstrap и минимальная логика smoke-ответа. |
| `src/modules/auth-session` | Валидация Telegram init data, включение test mode, bootstrap главного administrator. |
| `src/modules/identity-access` | Пользователи, назначение ролей, блокировка, policy по полномочиям administrator. |
| `src/modules/menu-catalog` | Категории, товары, цены, размеры напитков, группы допов и дополнительные опции. |
| `src/modules/slot-settings` | Рабочие часы и вместимость слотов. |

### `apps/backoffice-web`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/app` | Session bootstrap, router, layout, guards и навигация administrator. |
| `src/features/foundation-runtime` | Минимальный foundation shell для `FEATURE-001`, который вызывает backend foundation и показывает результат smoke. |
| `src/features/menu-management` | UI и state management для управления меню. |
| `src/features/user-access-management` | UI и state management для пользователей, ролей и блокировки. |
| `src/features/slot-settings` | UI и state management для рабочих часов и вместимости. |
| `src/shared/api` | Typed API-клиенты и адаптеры на базе `packages/shared-types`. |

### `apps/backoffice-bot`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/launch-entry` | Telegram-команда/entrypoint, открывающая backoffice WebApp. |

### `packages/shared-types`

| Планируемый пакетный срез | Назначение |
| --- | --- |
| `foundation-runtime` | DTO для smoke-контракта `GET /api/foundation/health`. |
| `auth-session` | Session bootstrap и информация о текущем пользователе/ролях. |
| `menu-catalog` | DTO для административного чтения и изменения меню. |
| `user-role-blocking` | DTO для списка пользователей, смены ролей и блокировки. |
| `slot-settings` | DTO для чтения и сохранения рабочих часов и вместимости. |

## Точки входа и маршруты

- `apps/backoffice-web`: entrypoint административного Telegram WebApp; для `FEATURE-001` root route `/` временно используется как direct URL foundation entrypoint в `local`/`test` runtime.
- `apps/backoffice-bot`: Telegram backoffice bot webhook/polling entrypoint для открытия WebApp.
- `apps/api`: основной backend runtime административного контура; в `FEATURE-001` обязателен только foundation endpoint `GET /api/foundation/health`.
- `packages/shared-types`: build-time entrypoint для shared foundation DTO и последующих административных контрактов.
- `apps/customer-web` и `apps/customer-bot` не являются точками входа `DU-01` и не должны появляться в child-задачах этой delivery unit.

## Зафиксированные ограничения по scope `DU-01`

- В `DU-01` не реализуются вкладки `orders` и `availability`, даже если они есть в общем backoffice UI-contract; эти вкладки относятся к `DU-03`.
- В `DU-01` не реализуются `unblock_user`, product image upload, real-time order indicators и другие элементы UI-контракта, для которых нет канонического бизнес-/system-подтверждения.
- Спор о том, кто может назначать новых `administrator`, должен быть локализован в backend policy/module и не должен размазываться по нескольким контурам.

## Где запускать и проверять

- Локальный запуск обязательных контуров `DU-01` и compose orchestration описываются в `infra/` и дублируются ссылкой здесь после появления реальных файлов.
- Для `FEATURE-001` первым воспроизводимым маршрутом запуска считается только связка `apps/api + apps/backoffice-web`; подключение `apps/backoffice-bot` и `PostgreSQL` начинается в следующих фичах.
- Команды unit tests и smoke-проверок для `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot` и `packages/shared-types` должны быть добавлены сюда после первого появления кода.
- Deployment path и environment-specific маршруты читаются из `deployment-map.md`.

## Когда обновлять карту

- Появился новый каталог верхнего уровня или новый runtime contour.
- Изменился entrypoint, способ запуска, путь к тестам или путь к deployment-артефакту.
- Появился новый shared package, новый внешний dependency edge или новый интеграционный модуль.
- Изменились env vars, которые важны для запуска, тестирования или деплоя.
