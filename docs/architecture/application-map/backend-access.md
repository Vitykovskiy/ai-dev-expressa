# Backend Access Application Map

## Граница

Серверный контур идентификации, bootstrap главного `administrator`, Telegram/test-mode авторизация, role guard для backoffice и users boundary для чтения списка пользователей и назначения роли.

## Модули

| Модуль                                          | Ответственность                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `IdentityAccessModule` или локальный эквивалент | Пользователи, роли, blocked state как доменная модель доступа.                                          |
| `BootstrapAdministrator`                        | Идемпотентно создаёт или обновляет пользователя из `ADMIN_TELEGRAM_ID` с ролью `administrator`.         |
| `TelegramAuth`                                  | Проверяет вход из служебного Telegram-бота и связывает `telegramId` с пользователем.                    |
| `TestModeAuth`                                  | Разрешает bypass Telegram только в test environment при `DISABLE_TG_AUTH=true`.                         |
| `BackofficeRoleGuard`                           | Защищает backoffice capabilities и прямые route/API обращения по ролям.                                 |
| `UsersService`                                  | Читает наблюдаемый список пользователей и назначает роли `barista` и `administrator` по users contract. |
| `UserRepository`                                | Читает и сохраняет пользователей, роли, `blocked state`, `displayName` и `telegramUsername`.            |
| `IdentityAccessPostgresqlClient`                | Подключается к `PostgreSQL` по `DATABASE_URL` и применяет schema bootstrap для users boundary.          |

## Реализация

| Путь                                                                                | Назначение                                                                                                                                                                  |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/src/identity-access/identity-access.module.ts`                             | NestJS-модуль серверного контура идентификации и доступа.                                                                                                                   |
| `backend/src/app.module.ts`                                                         | Подключает глобальный `ConfigModule` из `@nestjs/config` и загружает локальный `backend/.env.local`.                                                                        |
| `backend/src/main.ts`                                                               | Получает `PORT` через `ConfigService`, без прямого `dotenv` bootstrap.                                                                                                      |
| `backend/src/identity-access/config/access-config.ts`                               | Валидация `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH`, `SERVICE_TELEGRAM_BOT_TOKEN` и environment-ограничений по значениям, переданным из NestJS config layer.                   |
| `backend/src/identity-access/config/postgresql-config.ts`                           | Валидация `DATABASE_URL` и нормализация runtime-конфига для users persistent path.                                                                                          |
| `backend/src/identity-access/bootstrap/bootstrap-administrator.service.ts`          | Lifecycle bootstrap главного `administrator` при старте приложения.                                                                                                         |
| `backend/src/identity-access/domain/authenticated-actor.ts`                         | Канонический backend shape `AuthenticatedActor` и mapper из `User` в capabilities-aware actor response.                                                                     |
| `backend/src/identity-access/auth/backoffice-auth.input.ts`                         | Нормализация auth input для session body и guard header extraction без смешения с capability decision.                                                                      |
| `backend/src/identity-access/auth/telegram-init-data.verifier.ts`                   | Проверка подписи Telegram Web App `initData` через секрет служебного бота.                                                                                                  |
| `backend/src/identity-access/auth/backoffice-auth.service.ts`                       | Единая авторизация backoffice через Telegram или test-mode.                                                                                                                 |
| `backend/src/identity-access/auth/backoffice-auth.guard.ts`                         | Guard прямых обращений к backoffice capabilities; поддерживает capability из `:capability` path parameter и metadata decorator для статических backoffice endpoints.        |
| `backend/src/identity-access/users/users.controller.ts`                             | Consumer-facing HTTP boundary `GET /backoffice/users` и `PATCH /backoffice/users/{userId}/role`.                                                                            |
| `backend/src/identity-access/users/users.service.ts`                                | Orchestration чтения списка пользователей с фильтрами `search`, `role`, `blocked`, вычисления `availableRoleAssignments` и назначения роли.                                 |
| `backend/src/identity-access/users/users.errors.ts`                                 | Transport/business error mapping для users boundary: `role-not-assignable`, `user-not-found`, `identity-access-read-failed`, `identity-access-write-failed` и guard errors. |
| `backend/src/identity-access/users/user.repository.ts`                              | Контракт репозитория пользователей для списка, bootstrap, чтения по `userId` и сохранения ролевых изменений.                                                                |
| `backend/src/identity-access/users/postgresql-user.repository.ts`                   | PostgreSQL-адаптер users boundary с query path для списка, фильтрации и сохранения ролей.                                                                                   |
| `backend/src/identity-access/users/postgresql/identity-access-postgresql.client.ts` | Клиент `pg` с lifecycle hooks NestJS, транзакциями и bootstrap schema на старте модуля.                                                                                     |
| `backend/src/identity-access/users/postgresql/users-schema.ts`                      | SQL schema bootstrap `identity_access_users` и `identity_access_user_roles` для users boundary.                                                                             |
| `backend/src/identity-access/users/postgresql/postgresql-user-record.ts`            | Mapping persistent record `PostgreSQL` -> domain `User`.                                                                                                                    |

## Code architecture standard for FEATURE-004

- Контур `identity-access` должен сохранять разделение `config`, `bootstrap`, `auth`, `users` и module boundary.
- Auth service и guard не должны смешиваться с управлением меню, слотами, заказами или пользовательским UI behavior.
- `AuthenticatedActor` mapper, users error mapping и auth input normalization могут быть вынесены в отдельные domain/auth helper files, если contract и error mapping остаются неизменными.
- Config validation остаётся в `config/access-config.ts`; production запрет `DISABLE_TG_AUTH=true` нельзя переносить в controller или frontend.
- Config validation для `DATABASE_URL` остаётся в `config/postgresql-config.ts`; runtime path `PostgreSQL` не переносится в controller или frontend.
- Repository adapter отвечает только за хранение пользователей, ролей и списка с фильтрами; bootstrap, guard matrix и Telegram verification остаются отдельными responsibilities.
- Рефакторинг этого контура не должен менять `POST /backoffice/auth/session`, `GET /backoffice/:capability`, auth headers/body, `AuthenticatedActor`, capability semantics или error mapping из `docs/system/contracts/backoffice-auth-and-capability-access.md`.

## Endpoints

| Method  | Path                              | Назначение                                                                                                              |
| ------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `GET`   | `/health`                         | Техническая проверка живости backend.                                                                                   |
| `POST`  | `/backoffice/auth/session`        | Создаёт backoffice session context из Telegram `initData` или test-mode входа.                                          |
| `GET`   | `/backoffice/:capability`         | Проверяет прямой доступ к capability `orders`, `availability`, `menu`, `users`, `settings` через `BackofficeRoleGuard`. |
| `GET`   | `/backoffice/users`               | Возвращает список пользователей для users screen без смешения с `block_user` и `unblock_user`.                          |
| `PATCH` | `/backoffice/users/{userId}/role` | Назначает роль `barista` или `administrator` и возвращает пересчитанный доступ к вкладкам backoffice.                   |

## Auth headers and body

- Production/test с включённой Telegram auth: `POST /backoffice/auth/session` принимает body `{ "initData": "<telegram-web-app-init-data>" }`; прямые capability-запросы передают то же значение в header `x-telegram-init-data`.
- Test-mode: при `NODE_ENV=test DISABLE_TG_AUTH=true` body может содержать `{ "testTelegramId": "<id>" }`, а прямые capability-запросы могут передавать `x-test-telegram-id`. Если test id не передан, используется `ADMIN_TELEGRAM_ID`.

## Server contracts for FEATURE-001

- Канонический contract для `POST /backoffice/auth/session`, `GET /backoffice/:capability`, `AuthenticatedActor`, заголовков, error mapping и test-mode fallback находится в `docs/system/contracts/backoffice-auth-and-capability-access.md`.
- На старте системы должен существовать пользователь с `telegramId=ADMIN_TELEGRAM_ID` и ролью `administrator`.
- Повторный старт не должен создавать дубликаты пользователя или роли.
- Backoffice auth принимает только служебный Telegram entrypoint, кроме test-mode исключения.
- Role guard возвращает отказ для прямого доступа без Telegram в production.
- Role guard разрешает `administrator` доступ ко всем вкладкам backoffice, перечисленным в `identity-and-access.md`.
- Role guard разрешает `barista` только `orders` и `availability`, но назначение/управление barista не входит в эту feature.
- Для feature-specific backoffice endpoints без `:capability` в route используется metadata decorator с канонической capability, например `menu`.
- Backend handoff для FEATURE-001 считается невалидным, если состав `AuthenticatedActor` или guard semantics нужно восстанавливать из `backend/src/*` вместо системного contract.

## Handoff route for FEATURE-001

- Для server-side реализации сначала читать `docs/system/contracts/backoffice-auth-and-capability-access.md`, затем `docs/system/domain-model/identity-and-access.md`, затем эту карту и `docs/architecture/application-map/delivery-and-runtime.md`.
- Если меняются endpoint boundary, auth headers/body, env/config или guard behavior, обновляется эта карта и соответствующий system contract в одном handoff.

## Env/config

| Name                         | Required                   | Scope                                         | Правило                                                                                              |
| ---------------------------- | -------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ADMIN_TELEGRAM_ID`          | Да                         | production, test                              | Должен быть валидным Telegram identifier для bootstrap administrator.                                |
| `DISABLE_TG_AUTH`            | Нет                        | только test                                   | `true` разрешает test-mode без Telegram. В production значение `true` является ошибкой конфигурации. |
| `SERVICE_TELEGRAM_BOT_TOKEN` | Да для Telegram validation | production, test при включённой Telegram auth | Используется для проверки служебного Telegram-входа.                                                 |
| `DATABASE_URL`               | Да                         | production, test, local development           | Задаёт подключение backend к `PostgreSQL` для users boundary и других persistent доменных данных.    |

Runtime env загружается через `@nestjs/config` `ConfigModule`; прямой bootstrap через пакет `dotenv` в приложении не используется.

## Server contracts for FEATURE-004

- Канонический contract для `GET /backoffice/users`, `PATCH /backoffice/users/{userId}/role`, `availableRoleAssignments`, transport/business errors и запрета на `block_user`/`unblock_user` находится в `docs/system/contracts/user-role-and-blocking-management.md`.
- Users boundary должен читать и сохранять пользователей, роли, `blocked state`, `displayName` и `telegramUsername` через `PostgreSQL`; локальные test doubles не определяют runtime contract этой фичи.
- `GET /backoffice/users` должен возвращать `items[].availableRoleAssignments` без необходимости восстанавливать правило `BootstrapAdministrator` из frontend implementation.
- `PATCH /backoffice/users/{userId}/role` должен разрешать `barista` любому `administrator` с capability `users`, а `administrator` только `BootstrapAdministrator`, совпадающему с `ADMIN_TELEGRAM_ID`.
- Backend handoff для `FEATURE-004` считается невалидным, если shape users response, role assignment guard, `DATABASE_URL` runtime wiring или schema bootstrap `PostgreSQL` нужно восстанавливать из `backend/src/*` вместо system/architecture documentation.

## Handoff route for FEATURE-004

- Для server-side реализации users flow исполнитель читает `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, затем `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, затем `docs/system/contracts/user-role-and-blocking-management.md`, затем эту карту и `docs/architecture/application-map/delivery-and-runtime.md`.
- Если меняются endpoint boundary, runtime path `PostgreSQL`, migrations, env/config или error mapping users contract, обновляется эта карта и соответствующие handoff-артефакты в одном контуре.

## Запрещено в FEATURE-001

- Реализовывать назначение ролей, блокировку, меню или слоты.
- Делать test-mode авторизацию доступной в production.
- Доверять роли, присланной клиентом, без серверной проверки пользователя.
