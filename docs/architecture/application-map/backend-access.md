# Backend Access Application Map

## Граница

Серверный контур идентификации, bootstrap главного `administrator`, Telegram/test-mode авторизация и role guard для backoffice.

## Модули

| Модуль                                          | Ответственность                                                                                 |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `IdentityAccessModule` или локальный эквивалент | Пользователи, роли, blocked state как доменная модель доступа.                                  |
| `BootstrapAdministrator`                        | Идемпотентно создаёт или обновляет пользователя из `ADMIN_TELEGRAM_ID` с ролью `administrator`. |
| `TelegramAuth`                                  | Проверяет вход из служебного Telegram-бота и связывает `telegramId` с пользователем.            |
| `TestModeAuth`                                  | Разрешает bypass Telegram только в test environment при `DISABLE_TG_AUTH=true`.                 |
| `BackofficeRoleGuard`                           | Защищает backoffice capabilities и прямые route/API обращения по ролям.                         |

## Реализация

| Путь                                                                       | Назначение                                                                                                                                                           |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/src/identity-access/identity-access.module.ts`                    | NestJS-модуль серверного контура идентификации и доступа.                                                                                                            |
| `backend/src/app.module.ts`                                                | Подключает глобальный `ConfigModule` из `@nestjs/config` и загружает локальный `backend/.env.local`.                                                                 |
| `backend/src/main.ts`                                                      | Получает `PORT` через `ConfigService`, без прямого `dotenv` bootstrap.                                                                                               |
| `backend/src/identity-access/config/access-config.ts`                      | Валидация `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH`, `SERVICE_TELEGRAM_BOT_TOKEN` и environment-ограничений по значениям, переданным из NestJS config layer.            |
| `backend/src/identity-access/bootstrap/bootstrap-administrator.service.ts` | Lifecycle bootstrap главного `administrator` при старте приложения.                                                                                                  |
| `backend/src/identity-access/domain/authenticated-actor.ts`                | Канонический backend shape `AuthenticatedActor` и mapper из `User` в capabilities-aware actor response.                                                              |
| `backend/src/identity-access/auth/backoffice-auth.input.ts`                | Нормализация auth input для session body и guard header extraction без смешения с capability decision.                                                               |
| `backend/src/identity-access/auth/telegram-init-data.verifier.ts`          | Проверка подписи Telegram Web App `initData` через секрет служебного бота.                                                                                           |
| `backend/src/identity-access/auth/backoffice-auth.service.ts`              | Единая авторизация backoffice через Telegram или test-mode.                                                                                                          |
| `backend/src/identity-access/auth/backoffice-auth.guard.ts`                | Guard прямых обращений к backoffice capabilities; поддерживает capability из `:capability` path parameter и metadata decorator для статических backoffice endpoints. |
| `backend/src/identity-access/users/in-memory-user.repository.ts`           | Текущий in-memory адаптер `UserRepository`; замена на постоянное хранилище должна выполняться отдельной архитектурной задачей.                                       |

## FEATURE-004 backend implementation map

| Путь                                                             | Назначение                                                                                                                                      |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/src/identity-access/user-management.controller.ts`      | HTTP boundary для чтения пользователей и назначения роли через static backoffice endpoints с capability `users`.                                |
| `backend/src/identity-access/users/identity-access.service.ts`   | Application orchestration чтения списка, проверки целевого пользователя, назначения роли и пересчета target capabilities.                       |
| `backend/src/identity-access/users/user.repository.ts`           | Repository contract должен поддержать чтение списка пользователей и поиск по `userId` без смены storage adapter.                                |
| `backend/src/identity-access/users/in-memory-user.repository.ts` | In-memory adapter должен хранить пользователей так, чтобы `telegramId` auth lookup и `userId` role-management lookup оставались согласованными. |
| `backend/src/identity-access/domain/role.ts`                     | Canonical role/capability mapping для `customer`, `barista`, `administrator` и пересчета доступа после изменения роли.                          |
| `backend/src/identity-access/domain/user.ts`                     | Role mutation helpers должны обновлять операционную backoffice-роль и сохранять `customer` и `blocked` как отдельные состояния.                 |
| `backend/test/user-role-management*.spec.ts`                     | Unit/integration evidence для списка пользователей, назначения `barista`, назначения `administrator` главным administrator и error mapping.     |

## Code architecture standard for FEATURE-006

- Контур `identity-access` должен сохранять разделение `config`, `bootstrap`, `auth`, `users` и module boundary.
- Auth service и guard не должны смешиваться с управлением меню, слотами, заказами или пользовательским UI behavior.
- `AuthenticatedActor` mapper и auth input normalization могут быть вынесены в отдельные domain/auth helper files, если contract и error mapping остаются неизменными.
- Config validation остаётся в `config/access-config.ts`; production запрет `DISABLE_TG_AUTH=true` нельзя переносить в controller или frontend.
- Repository adapter отвечает только за хранение пользователей и ролей; bootstrap, guard matrix и Telegram verification остаются отдельными responsibilities.
- Рефакторинг этого контура не должен менять `POST /backoffice/auth/session`, `GET /backoffice/:capability`, auth headers/body, `AuthenticatedActor`, capability semantics или error mapping из `docs/system/contracts/backoffice-auth-and-capability-access.md`.

## Endpoints

| Method  | Path                                             | Назначение                                                                                                               |
| ------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `GET`   | `/health`                                        | Техническая проверка живости backend.                                                                                    |
| `POST`  | `/backoffice/auth/session`                       | Создаёт backoffice session context из Telegram `initData` или test-mode входа.                                           |
| `GET`   | `/backoffice/:capability`                        | Проверяет прямой доступ к capability `orders`, `availability`, `menu`, `users`, `settings` через `BackofficeRoleGuard`.  |
| `GET`   | `/backoffice/user-management/users`              | Возвращает список пользователей для вкладки `Пользователи`; endpoint использует static capability guard `users`.         |
| `PATCH` | `/backoffice/user-management/users/:userId/role` | Назначает целевому пользователю роль `barista` или `administrator`; endpoint использует static capability guard `users`. |

## Auth headers and body

- Production/test с включённой Telegram auth: `POST /backoffice/auth/session` принимает body `{ "initData": "<telegram-web-app-init-data>" }`; прямые capability-запросы передают то же значение в header `x-telegram-init-data`.
- Test-mode: при `NODE_ENV=test DISABLE_TG_AUTH=true` body может содержать `{ "testTelegramId": "<id>" }`, а прямые capability-запросы могут передавать `x-test-telegram-id`. Если test id не передан, используется `ADMIN_TELEGRAM_ID`.
- Static endpoints FEATURE-004 используют те же Telegram/test-mode headers, что и `GET /backoffice/:capability`, но capability берут из metadata decorator `users`, а не из path parameter.

## Server contracts for FEATURE-004

- `GET /backoffice/user-management/users` возвращает `{ "users": BackofficeManagedUser[] }`.
- `PATCH /backoffice/user-management/users/:userId/role` принимает body `{ "assignedRole": "barista" | "administrator" }` и возвращает `{ "user": BackofficeManagedUser }`.
- `BackofficeManagedUser` содержит `userId`, `telegramId`, `roles`, `blocked`, `displayLabel` при наличии и `capabilities`, рассчитанные по backend role/capability mapping.
- Endpoint чтения списка требует authenticated actor с capability `users`.
- Endpoint назначения роли требует authenticated actor с capability `users`.
- Назначение `assignedRole=administrator` дополнительно требует, чтобы `actor.telegramId` совпадал с `ADMIN_TELEGRAM_ID`.
- Назначение роли обновляет операционную backoffice-роль target user на `assignedRole` и сохраняет существующую роль `customer`, если она была у target user.
- FEATURE-004 не предоставляет отдельный flow снятия роли `barista`.
- FEATURE-004 не выполняет снятие роли `barista`, блокировку, разблокировку или создание пользователя.
- После успешного изменения роли backend возвращает target user с пересчитанными `capabilities`; frontend использует этот ответ для обновления строки и не вычисляет финальный доступ локально.
- Error mapping FEATURE-004: `administrator-role-required` -> `403 Forbidden`; `main-administrator-required` -> `403 Forbidden`; `role-not-assignable` -> `400 Bad Request`; `user-not-found` -> `404 Not Found`.
- FEATURE-004 не добавляет runtime variables и не меняет deployment route.

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

## Handoff route for FEATURE-004

- Для server-side реализации управления ролями пользователей исполнитель читает `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, затем `behavior.md`, `interfaces.md`, `test-scenarios.md`, затем `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/domain-model/identity-and-access.md`, эту карту и `docs/system/contracts/backoffice-auth-and-capability-access.md`.
- Реализация остается внутри `identity-access` boundary и не смешивается с меню, слотами, заказами или клиентским UI behavior.
- Если endpoint boundary, DTO shape, error mapping или guard главного administrator меняются относительно этой карты, нужно вернуть изменение в архитектурный handoff до реализации.

## Env/config

| Name                         | Required                   | Scope                                         | Правило                                                                                              |
| ---------------------------- | -------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ADMIN_TELEGRAM_ID`          | Да                         | production, test                              | Должен быть валидным Telegram identifier для bootstrap administrator.                                |
| `DISABLE_TG_AUTH`            | Нет                        | только test                                   | `true` разрешает test-mode без Telegram. В production значение `true` является ошибкой конфигурации. |
| `SERVICE_TELEGRAM_BOT_TOKEN` | Да для Telegram validation | production, test при включённой Telegram auth | Используется для проверки служебного Telegram-входа.                                                 |

Runtime env загружается через `@nestjs/config` `ConfigModule`; прямой bootstrap через пакет `dotenv` в приложении не используется.

## Запрещено в FEATURE-001

- Реализовывать назначение ролей, блокировку, меню или слоты.
- Делать test-mode авторизацию доступной в production.
- Доверять роли, присланной клиентом, без серверной проверки пользователя.
