# Карта приложения

## Назначение

Этот документ помогает быстро понять, где находится каждый контур приложения, как он запускается, чем он зависит от соседних модулей и какие изменения требуют обновления документации.

## Текущее состояние

- На текущем этапе прикладной код еще не добавлен в репозиторий.
- Эта карта фиксирует целевую структуру, по которой должны создаваться первые модули и каталоги.
- Первая фактическая реализация в репозитории должна соответствовать срезу `DU-01` из `du-01-administration.md`, а не полному scope всех будущих delivery units.
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

## Внутренняя декомпозиция обязательных контуров

### `apps/api`

| Планируемый модуль | Назначение |
| --- | --- |
| `src/modules/auth-session` | Валидация Telegram init data, включение test mode, bootstrap главного administrator. |
| `src/modules/identity-access` | Пользователи, назначение ролей, блокировка, policy по полномочиям administrator. |
| `src/modules/menu-catalog` | Категории, товары, цены, размеры напитков, группы допов и дополнительные опции. |
| `src/modules/slot-settings` | Рабочие часы и вместимость слотов. |

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

| Планируемый пакетный срез | Назначение |
| --- | --- |
| `auth-session` | Session bootstrap и информация о текущем пользователе/ролях. |
| `menu-catalog` | DTO для административного чтения и изменения меню. |
| `user-role-blocking` | DTO для списка пользователей, смены ролей и блокировки. |
| `slot-settings` | DTO для чтения и сохранения рабочих часов и вместимости. |

## Точки входа и маршруты

- `apps/backoffice-web`: entrypoint административного Telegram WebApp; прямой рабочий доступ по URL не считается штатным сценарием.
- `apps/backoffice-bot`: Telegram backoffice bot webhook/polling entrypoint для открытия WebApp.
- `apps/api`: основной backend runtime административного контура.
- `apps/customer-web` и `apps/customer-bot` не являются точками входа `DU-01` и не должны появляться в child-задачах этой delivery unit.

## Зафиксированные ограничения по scope `DU-01`

- В `DU-01` не реализуются вкладки `orders` и `availability`, даже если они есть в общем backoffice UI-contract; эти вкладки относятся к `DU-03`.
- В `DU-01` не реализуются `unblock_user`, product image upload, real-time order indicators и другие элементы UI-контракта, для которых нет канонического бизнес-/system-подтверждения.
- Спор о том, кто может назначать новых `administrator`, должен быть локализован в backend policy/module и не должен размазываться по нескольким контурам.

## Где запускать и проверять

- Локальный запуск обязательных контуров `DU-01` и compose orchestration описываются в `infra/` и дублируются ссылкой здесь после появления реальных файлов.
- Команды unit tests и smoke-проверок для `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot` и `packages/shared-types` должны быть добавлены сюда после первого появления кода.
- Deployment path и environment-specific маршруты читаются из `deployment-map.md`.

## Когда обновлять карту

- Появился новый каталог верхнего уровня или новый runtime contour.
- Изменился entrypoint, способ запуска, путь к тестам или путь к deployment-артефакту.
- Появился новый shared package, новый внешний dependency edge или новый интеграционный модуль.
- Изменились env vars, которые важны для запуска, тестирования или деплоя.
