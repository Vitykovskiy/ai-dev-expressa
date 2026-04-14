# Архитектурная рамка `DU-01`

## Назначение

Этот документ фиксирует архитектурные ограничения первой delivery unit `DU-01`, чтобы `frontend`, `backend`, `devops` и `qa` работали от одной и той же рамки и не расширяли scope административной поставки за пределы подтвержденных артефактов.

## Reviewable outcome `DU-01`

- Administrator открывает backoffice через `Telegram backoffice-бота` или через test mode при `DISABLE_TG_AUTH=true`.
- Administrator работает только с административным срезом: `Меню`, `Пользователи`, `Настройки`.
- Система поддерживает bootstrap главного administrator через `ADMIN_TELEGRAM_ID`, управление каталогом, ролями/блокировкой и рабочими часами/вместимостью слотов.
- Результат разворачивается и проверяется как отдельный административный контур без customer- и barista-сценариев из следующих delivery units.

## Обязательные контуры `DU-01`

| Контур | Обязателен в `DU-01` | Назначение |
| --- | --- | --- |
| `apps/api` | Да | Административные read/write контракты, Telegram/test-mode auth, bootstrap главного administrator, доступ к PostgreSQL. |
| `apps/backoffice-web` | Да | Telegram WebApp для administrator с вкладками `Меню`, `Пользователи`, `Настройки`. |
| `apps/backoffice-bot` | Да | Telegram entrypoint для запуска административного WebApp. |
| `packages/shared-types` | Да | Единый источник DTO, enum и схем для `apps/api` и `apps/backoffice-web`. |
| `infra/` | Да | Локальный runtime, deploy scripts, env templates и smoke-маршрут для административного среза. |
| `.github/workflows` | Да | CI/CD для сборки, тестирования и выката административного среза. |
| `PostgreSQL` | Да | Хранение пользователей, ролей, блокировки, каталога и настроек слотов. |

## Явно вне scope `DU-01`

- `apps/customer-web` и `apps/customer-bot`; эти контуры стартуют в следующих delivery units.
- Операционные сценарии `barista`: очередь заказов, подтверждение, отклонение, `Готов к выдаче`, закрытие заказа, временная доступность меню и Telegram-напоминания.
- Customer read-side и создание заказа; `DU-01` готовит административные данные, но не выпускает customer journey.
- Действие `unblock_user`; оно присутствует во входном UI-контракте, но не подтверждено бизнес- и системными артефактами.
- `image upload` для товаров, real-time индикаторы новых заказов и жёсткая верхняя граница `slot_capacity = 50`; эти элементы не являются каноническими требованиями.
- Выделение `packages/ui` как обязательного shared-контура. В `DU-01` допустима реализация UI внутри `apps/backoffice-web`; общий UI-пакет вводится только при подтверждённой межконтурной переиспользуемости.

## Межконтурные правила

- Telegram остаётся обязательным каналом доступа в рабочем режиме; прямой доступ по URL не считается штатным сценарием.
- Исключение без Telegram допустимо только в test environment и должно быть централизовано через `DISABLE_TG_AUTH=true`, а не через отдельные обходы в `frontend`.
- `apps/backoffice-bot` в `DU-01` отвечает только за вход в административный WebApp; логика напоминаний barista в него не входит.
- `apps/api` публикует только административные контракты `DU-01`: bootstrap/auth session, menu catalog management, user role and blocking management, slot settings management.
- Любая проверка прав доступа и спорных полномочий должна жить в backend policy/service-слое; `frontend` не должен хардкодить правило, кто именно может назначать новых `administrator`.
- `packages/shared-types` обязателен для синхронизации DTO и enum между `apps/api` и `apps/backoffice-web`; ручное дублирование контрактов недопустимо.

## Модульная декомпозиция `DU-01`

### `apps/api`

- `auth-session`
  - Проверка Telegram init data или включение test mode.
  - Bootstrap главного administrator из `ADMIN_TELEGRAM_ID`.
- `identity-access`
  - Список пользователей, назначение ролей `barista` / `administrator`, блокировка пользователя.
  - Изоляция policy по спорному праву назначения `administrator`.
- `menu-catalog`
  - Категории меню, товары, размеры напитков, группы дополнительных опций, дополнительные опции.
- `slot-settings`
  - Рабочие часы и вместимость слотов.

### `apps/backoffice-web`

- `app-shell`
  - Telegram/test-mode session bootstrap, router, guards, layout для administrator.
- `features/menu-management`
  - UI и state management для управления меню.
- `features/user-access-management`
  - UI списка пользователей, назначения ролей и блокировки.
- `features/slot-settings`
  - UI редактирования рабочих часов и вместимости слотов.
- `shared/api`
  - Typed adapters на основе `packages/shared-types`.

### `apps/backoffice-bot`

- `launch-entry`
  - Точка входа в Telegram для открытия backoffice WebApp.

### `packages/shared-types`

- `auth-session`
- `menu-catalog`
- `user-role-blocking`
- `slot-settings`

## Правила декомпозиции child-задач

- `FE` получает один reviewable outcome: administrator может пройти административный UI-сценарий `Меню` / `Пользователи` / `Настройки`.
- `BE` получает один reviewable outcome: административные API и доменные правила работают в test mode и готовы к интеграции с Telegram backoffice entrypoint.
- `DO` получает один reviewable outcome: административный контур поднимается локально и проходит CI/deploy smoke-check как отдельный runtime slice.
- `QA` получает один reviewable outcome: есть проверяемый приёмочный сценарий `administrator` и зафиксирован результат проверки `DU-01`.
- Если для реализации требуется новый runtime contour, shared package, env var или deployment path, это считается изменением архитектурной рамки и должно быть сначала отражено в `application-map.md`, `deployment-map.md` и при необходимости в `README.md`.

## Зафиксированные риски и открытые вопросы

- Право назначения роли `administrator` остаётся противоречивым во входных материалах. До уточнения реализация должна изолировать policy на backend и не привязывать UI к предположению про "главного" или "любого" administrator.
- Действие `unblock_user` не входит в `DU-01`, пока для него нет подтверждённого системного контракта.
- Customer- и barista-сценарии остаются зависимыми от административного контура `DU-01`, но не должны протаскивать свои runtime-требования в эту поставку.
