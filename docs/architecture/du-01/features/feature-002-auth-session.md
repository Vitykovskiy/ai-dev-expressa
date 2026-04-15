# Архитектурный контур `FEATURE-002`

Этот документ фиксирует independently reviewable auth/session-slice `DU-01.F02` внутри delivery unit `DU-01`. Общая рамка административной поставки, межконтурные правила и backlog остальных фич зафиксированы в `../README.md`.

## Reviewable outcome `DU-01.F02`

- `FEATURE-002` переводит административный контур из технического foundation-smoke в рабочий auth/session slice: administrator может открыть backoffice через `Telegram backoffice-бота`, а для `local` или lightweight `test` runtime допускается исключение через `DISABLE_TG_AUTH=true`.
- В `FEATURE-002` впервые становятся обязательными `apps/backoffice-bot`, `PostgreSQL` и persistence/bootstrap path для пользователя с ролью `administrator`; этот feature-slice не может считаться завершённым без воспроизводимого runtime-контура `api + backoffice-web + backoffice-bot + postgres`.
- `apps/api` публикует отдельный auth/session-контракт `DU-01.F02`, который валидирует Telegram init data или test mode, идемпотентно bootstrap-ит главного administrator из `ADMIN_TELEGRAM_ID` и возвращает typed административную сессию для `apps/backoffice-web`.
- `apps/backoffice-web` перестаёт быть просто foundation-экраном: root shell становится boundary для session bootstrap, administrator guard и минимального административного layout, но не реализует в этом feature-срезе `menu-management`, `user-access-management` и `slot-settings`.
- Smoke считается успешным, когда administrator получает валидную административную сессию, попадает в минимальный backoffice shell, а blocked-user или пользователь без роли `administrator` получают явный отказ без доступа к административному layout.

## Обязательные контуры `FEATURE-002`

| Контур | Обязателен в `FEATURE-002` | Что должно появиться в auth/session slice |
| --- | --- | --- |
| `apps/api` | Да | `NestJS` runtime с `auth-session`, конфигурацией Telegram/test-mode auth, bootstrap главного administrator и persistence для user/session state. |
| `apps/backoffice-web` | Да | Auth bootstrap boundary, typed вызов auth/session-контракта, administrator guard и минимальный shell после входа. |
| `apps/backoffice-bot` | Да | Telegram entrypoint, который открывает backoffice WebApp и становится штатным способом входа в рабочем режиме. |
| `packages/shared-types` | Да | Typed DTO и enum для auth/session request-response, session state и error branches без ручного дублирования между frontend и backend. |
| `PostgreSQL` / `Prisma` | Да | Persistence для bootstrap главного administrator, хранения пользователя, ролей и blocked-состояния. |
| `infra/` | Да | Local/test runtime `FEATURE-002`, env templates, migrations/bootstrap path и smoke-маршрут auth/session-среза. |
| `.github/workflows` | Да | CI validation `typecheck + test + build + smoke` для auth/session-среза, включая bot/runtime и persistence-изменения feature. |

## Точки входа и конфигурация `FEATURE-002`

- `apps/api/src/main.ts` продолжает поднимать основной HTTP runtime, но `FEATURE-002` обязан расширить его до `auth-session` и persistence-инициализации.
- В `apps/api` появляются `auth-session` и минимально необходимая часть `identity-access`, достаточная для bootstrap главного administrator, чтения ролей и blocked-состояния; CRUD-операции управления пользователями остаются в `FEATURE-004`.
- `apps/api/prisma/schema.prisma` и `apps/api/prisma/migrations` становятся каноническим путём persistence-модели `FEATURE-002`; вынос persistence в другой каталог без отдельного архитектурного решения не допускается.
- `apps/backoffice-web/src/main.ts` остаётся frontend entrypoint, а root route `/` перестаёт быть чисто техническим foundation-screen и становится boundary для session bootstrap и перехода в минимальный административный shell.
- Прямой рабочий вход по URL без Telegram запрещён; исключение допустимо только при `DISABLE_TG_AUTH=true`, и оно должно проходить через тот же backend auth/session-контракт, а не через отдельный frontend-only mock flow.
- `apps/backoffice-bot/src/main.ts` становится runtime entrypoint процесса Telegram-бота; модуль `launch-entry` внутри него отвечает только за открытие WebApp и не включает бариста-напоминания или другой сценарий вне `FEATURE-002`.
- Обязательные env vars `FEATURE-002`: `API_PORT`, `API_CORS_ALLOWED_ORIGIN`, `VITE_API_BASE_URL`, `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH`, `DATABASE_URL`, `TG_BACKOFFICE_BOT_TOKEN`.
- `packages/shared-types` экспортирует auth/session DTO и enum через отдельный пакетный срез `auth-session`; дублирование request-response контракта между `apps/api` и `apps/backoffice-web` запрещено.

## Явно вне scope `FEATURE-002`

- Административные capability `menu-management`, `user-access-management` и `slot-settings`, включая write/read контракты этих модулей и финальные вкладки управления.
- Полноценные сценарии `orders` и `availability`, относящиеся к следующей delivery unit и barista-роли.
- Customer- и barista-контуры, `apps/customer-web`, `apps/customer-bot`, `TG_CUSTOMER_BOT_TOKEN` и любые customer-specific use cases.
- Назначение ролей, блокировка и другие административные операции поверх уже открытой сессии; `FEATURE-002` готовит только session/bootstrap slice и server-side policy boundary.
- Любой обход backend policy в frontend, включая hardcoded-проверки прав назначения `administrator`.

## Smoke path `FEATURE-002`

1. Поднимается `PostgreSQL`, затем применяется schema/migration path для user/persistence слоя `FEATURE-002`.
2. Запускается `apps/api` с `API_PORT`, `API_CORS_ALLOWED_ORIGIN`, `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и `DATABASE_URL`.
3. Запускается `apps/backoffice-web` с `VITE_API_BASE_URL`, указывающим на backend auth/session runtime.
4. Запускается `apps/backoffice-bot` с `TG_BACKOFFICE_BOT_TOKEN` как штатный Telegram entrypoint фичи.
5. Smoke либо открывает backoffice через `Telegram backoffice-бота` и передаёт Telegram init data, либо в lightweight `test` runtime использует тот же auth/session backend flow при `DISABLE_TG_AUTH=true`.
6. Backend идемпотентно bootstrap-ит главного administrator из `ADMIN_TELEGRAM_ID`, возвращает typed административную сессию и отклоняет blocked/non-administrator ветки.
7. Frontend открывает минимальный administrator shell; отсутствие `menu/users/settings` capability не считается дефектом этого feature-slice, если session bootstrap и guard работают отдельно и воспроизводимо.
