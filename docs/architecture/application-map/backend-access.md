# Backend Access Application Map

## Граница

Серверный контур идентификации, bootstrap главного `administrator`, Telegram/test-mode авторизация и role guard для backoffice.

## Модули

| Модуль | Ответственность |
|---|---|
| `IdentityAccessModule` или локальный эквивалент | Пользователи, роли, blocked state как доменная модель доступа. |
| `BootstrapAdministrator` | Идемпотентно создаёт или обновляет пользователя из `ADMIN_TELEGRAM_ID` с ролью `administrator`. |
| `TelegramAuth` | Проверяет вход из служебного Telegram-бота и связывает `telegramId` с пользователем. |
| `TestModeAuth` | Разрешает bypass Telegram только в test environment при `DISABLE_TG_AUTH=true`. |
| `BackofficeRoleGuard` | Защищает backoffice capabilities и прямые route/API обращения по ролям. |

## Реализация

| Путь | Назначение |
|---|---|
| `backend/src/identity-access/identity-access.module.ts` | NestJS-модуль серверного контура идентификации и доступа. |
| `backend/src/app.module.ts` | Подключает глобальный `ConfigModule` из `@nestjs/config` и загружает корневой `.env`. |
| `backend/src/main.ts` | Получает `PORT` через `ConfigService`, без прямого `dotenv` bootstrap. |
| `backend/src/identity-access/config/access-config.ts` | Валидация `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH`, `SERVICE_TELEGRAM_BOT_TOKEN` и environment-ограничений по значениям, переданным из NestJS config layer. |
| `backend/src/identity-access/bootstrap/bootstrap-administrator.service.ts` | Lifecycle bootstrap главного `administrator` при старте приложения. |
| `backend/src/identity-access/auth/telegram-init-data.verifier.ts` | Проверка подписи Telegram Web App `initData` через секрет служебного бота. |
| `backend/src/identity-access/auth/backoffice-auth.service.ts` | Единая авторизация backoffice через Telegram или test-mode. |
| `backend/src/identity-access/auth/backoffice-auth.guard.ts` | Guard прямых обращений к backoffice capabilities; поддерживает capability из `:capability` path parameter и metadata decorator для статических backoffice endpoints. |
| `backend/src/identity-access/users/in-memory-user.repository.ts` | Текущий in-memory адаптер `UserRepository`; замена на постоянное хранилище должна выполняться отдельной архитектурной задачей. |

## Endpoints

| Method | Path | Назначение |
|---|---|---|
| `GET` | `/health` | Техническая проверка живости backend. |
| `POST` | `/backoffice/auth/session` | Создаёт backoffice session context из Telegram `initData` или test-mode входа. |
| `GET` | `/backoffice/:capability` | Проверяет прямой доступ к capability `orders`, `availability`, `menu`, `users`, `settings` через `BackofficeRoleGuard`. |

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

| Name | Required | Scope | Правило |
|---|---|---|---|
| `ADMIN_TELEGRAM_ID` | Да | production, test | Должен быть валидным Telegram identifier для bootstrap administrator. |
| `DISABLE_TG_AUTH` | Нет | только test | `true` разрешает test-mode без Telegram. В production значение `true` является ошибкой конфигурации. |
| `SERVICE_TELEGRAM_BOT_TOKEN` | Да для Telegram validation | production, test при включённой Telegram auth | Используется для проверки служебного Telegram-входа. |

Runtime env загружается через `@nestjs/config` `ConfigModule`; прямой bootstrap через пакет `dotenv` в приложении не используется.

## Запрещено в FEATURE-001

- Реализовывать назначение ролей, блокировку, меню или слоты.
- Делать test-mode авторизацию доступной в production.
- Доверять роли, присланной клиентом, без серверной проверки пользователя.
