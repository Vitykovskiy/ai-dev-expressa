# Архитектурная рамка `DU-01`

## Назначение

Этот документ фиксирует архитектурные ограничения первой delivery unit `DU-01`, backlog фич `Sprint-001` и правила их реализации, чтобы `frontend`, `backend`, `devops` и `qa` работали от одной и той же рамки и не расширяли scope административной поставки за пределы подтвержденных артефактов.

## Reviewable outcome `DU-01`

- Administrator открывает backoffice через `Telegram backoffice-бота` или через test mode при `DISABLE_TG_AUTH=true`.
- Administrator работает только с административным срезом: `Меню`, `Пользователи`, `Настройки`.
- Система поддерживает bootstrap главного administrator через `ADMIN_TELEGRAM_ID`, управление каталогом, ролями/блокировкой и рабочими часами/вместимостью слотов.
- Результат разворачивается и проверяется как отдельный административный контур без customer- и barista-сценариев из следующих delivery units.

## Обязательные контуры `DU-01`

| Контур | Обязателен в `DU-01` | Назначение |
| --- | --- | --- |
| `apps/api` | Да | `NestJS`-backend с административными read/write контрактами, Telegram/test-mode auth, bootstrap главного administrator и доступом к PostgreSQL. |
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

- Telegram остаётся обязательным каналом доступа в рабочем режиме, начиная с `FEATURE-002`; прямой доступ по URL не считается штатным сценарием для собранного административного контура `DU-01`.
- Для `FEATURE-001` прямой доступ по URL допустим только в `local` или lightweight `test` runtime как технический foundation entrypoint для smoke `client -> server`.
- Исключение без Telegram через `DISABLE_TG_AUTH=true` допустимо только после появления `auth-session`; `FEATURE-001` не должен вводить отдельный псевдо-auth flow в `frontend`.
- `apps/backoffice-bot` в `DU-01` отвечает только за вход в административный WebApp; логика напоминаний barista в него не входит.
- Backend `DU-01` реализуется на `NestJS`; ввод другого backend framework без отдельного архитектурного решения не допускается.
- `apps/api` публикует только административные контракты `DU-01`: bootstrap/auth session, menu catalog management, user role and blocking management, slot settings management.
- Любая проверка прав доступа и спорных полномочий должна жить в backend policy/service-слое; `frontend` не должен хардкодить правило, кто именно может назначать новых `administrator`.
- `packages/shared-types` обязателен для синхронизации DTO и enum между `apps/api` и `apps/backoffice-web`; ручное дублирование контрактов недопустимо.

## Модульная декомпозиция `DU-01`

### `apps/api`

- Runtime: `NestJS`.
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

## Feature backlog `Sprint-001`

- `FEATURE-001` — foundation/runtime bootstrap: локальный и test runtime поднят, frontend ходит в backend и получает валидный ответ.
- `FEATURE-002` — administrator auth/session: Telegram/test-mode session bootstrap и роль administrator.
- `FEATURE-003` — menu management: administrator управляет меню в подтвержденном scope `DU-01`.
- `FEATURE-004` — user access management: administrator управляет ролями и блокировкой пользователей.
- `FEATURE-005` — slot settings: administrator управляет рабочими часами и вместимостью слотов.

## Архитектурный контур `FEATURE-001`

### Reviewable outcome `DU-01.F01`

- В `local` или lightweight `test` runtime поднимаются только `apps/api` и `apps/backoffice-web`; `packages/shared-types`, `infra/` и `.github/workflows` участвуют как supporting contours.
- `apps/backoffice-web` открывается по прямому URL только как технический foundation entrypoint и не реализует Telegram session bootstrap, route guards или административные вкладки `Меню` / `Пользователи` / `Настройки`.
- `apps/api` публикует единственный foundation-контракт `GET /api/foundation/health`, который используется для smoke-проверки связки `client -> server`.
- Smoke считается успешным, когда frontend foundation получает typed-ответ `{ status: 'ok', service: 'api' }` от backend foundation и явно отображает успешный статус без обращения к `PostgreSQL`, `backoffice-bot` и административным use case.

### Обязательные контуры `FEATURE-001`

| Контур | Обязателен в `FEATURE-001` | Что должно появиться в first slice |
| --- | --- | --- |
| `apps/api` | Да | `NestJS` bootstrap, минимальная config-инициализация, CORS для backoffice-web и endpoint `GET /api/foundation/health`. |
| `apps/backoffice-web` | Да | Минимальный shell c root route `/`, который вызывает foundation endpoint и показывает результат. |
| `packages/shared-types` | Да | Typed DTO для foundation smoke-контракта `client -> server`; ручное дублирование формы ответа недопустимо. |
| `infra/` | Да | Локальный/test runtime только для `api + backoffice-web`, env templates и smoke-маршрут foundation-среза. |
| `.github/workflows` | Да | Pipeline validation install/test/build для foundation-среза без обязательного подключения bot/runtime следующей фичи. |
| `apps/backoffice-bot` | Нет | Стартует вместе с `FEATURE-002`, когда появляется Telegram entrypoint и session bootstrap. |
| `PostgreSQL` / `Prisma` | Нет | Подключаются в первой feature, где реально появляется persistence или bootstrap administrator; `FEATURE-001` не должен тащить их как пустую подготовку. |

### Точки входа и конфигурация `FEATURE-001`

- `apps/api/src/main.ts` поднимает HTTP runtime на `API_PORT`.
- `apps/api` публикует только `GET /api/foundation/health`; добавление auth/session, menu, users или slot endpoints в `FEATURE-001` запрещено.
- `apps/backoffice-web/src/main.ts` поднимает foundation shell; root route `/` использует `VITE_API_BASE_URL` для вызова backend foundation.
- `API_CORS_ALLOWED_ORIGIN` задаёт origin, с которого `apps/backoffice-web` может вызывать `apps/api` в local/test runtime.
- `packages/shared-types` экспортирует foundation DTO и используется обеими сторонами связки `client -> server`.

### Явно вне scope `FEATURE-001`

- `apps/backoffice-bot`, Telegram Bot API, Telegram WebApp init data и любые runtime-решения для штатного Telegram-входа.
- `DISABLE_TG_AUTH`, `ADMIN_TELEGRAM_ID`, `TG_BACKOFFICE_BOT_TOKEN`, `DATABASE_URL`, Prisma schema/migrations и любая инициализация persistence.
- Административные use case `auth-session`, `menu-management`, `user-access-management`, `slot-settings`, route guards и role-aware layout.
- Customer- и barista-контуры, а также любые shared-пакеты кроме `packages/shared-types`.

### Smoke path `FEATURE-001`

1. Запускается `apps/api` с конфигурацией `API_PORT` и `API_CORS_ALLOWED_ORIGIN`.
2. Запускается `apps/backoffice-web` с `VITE_API_BASE_URL`, указывающим на `apps/api`.
3. Smoke открывает root route `/` backoffice-web в `local` или lightweight `test` runtime.
4. Frontend выполняет `GET /api/foundation/health`, получает `200 OK` и тело `{ status: 'ok', service: 'api' }`.
5. UI отображает успешный ответ; отсутствие `backoffice-bot`, auth/session и `PostgreSQL` не считается дефектом этого feature-slice.

## Правила декомпозиции feature-задач

- Архитектор сначала создает backlog фич `Sprint-001`, а не весь комплект `AR/FE/BE/DO` на весь спринт.
- `FEATURE-*` должна давать один independently reviewable vertical slice с собственным smoke/scenario.
- Если фичу нельзя развернуть, проверить отдельно и показать без недостающих соседних change set, она декомпозирована недостаточно.
- Для активной фичи сначала создается `AR-*`, фиксирующая контур фичи и правила дальнейшей нарезки, и только затем `FE/BE/DO-*`.
- Для `FEATURE-001` reviewable outcome распределяется так:
  - `BE`: базовый runtime поднимается и публикует минимальный endpoint для smoke-проверки.
  - `FE`: базовый клиент поднимается и подтверждает рабочий вызов в backend.
  - `DO`: локальный/test runtime, deploy path и smoke-маршрут воспроизводимы.
- `QA` по умолчанию относится к `Sprint-001` и фиксирует финальную приемку всего административного инкремента после завершения обязательных фич.
- Если для реализации требуется новый runtime contour, shared package, env var или deployment path, это считается изменением архитектурной рамки и должно быть сначала отражено в `application-map.md`, `deployment-map.md` и при необходимости в `README.md`.

## Зафиксированные риски и открытые вопросы

- Право назначения роли `administrator` остаётся противоречивым во входных материалах. До уточнения реализация должна изолировать policy на backend и не привязывать UI к предположению про "главного" или "любого" administrator.
- Действие `unblock_user` не входит в `DU-01`, пока для него нет подтверждённого системного контракта.
- Customer- и barista-сценарии остаются зависимыми от административного контура `DU-01`, но не должны протаскивать свои runtime-требования в эту поставку.
