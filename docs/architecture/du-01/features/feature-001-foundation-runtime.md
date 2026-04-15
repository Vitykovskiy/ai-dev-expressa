# Архитектурный контур `FEATURE-001`

Этот документ фиксирует independently reviewable foundation-slice `DU-01.F01` внутри delivery unit `DU-01`. Общая рамка административной поставки, межконтурные правила и backlog остальных фич зафиксированы в `../README.md`.

## Reviewable outcome `DU-01.F01`

- В `local` или lightweight `test` runtime поднимаются только `apps/api` и `apps/backoffice-web`; `packages/shared-types`, `infra/` и `.github/workflows` участвуют как supporting contours.
- `apps/backoffice-web` открывается по прямому URL только как технический foundation entrypoint и не реализует Telegram session bootstrap, route guards или административные вкладки `Меню` / `Пользователи` / `Настройки`.
- `apps/api` публикует единственный foundation-контракт `GET /api/foundation/health`, который используется для smoke-проверки связки `client -> server`.
- Smoke считается успешным, когда frontend foundation получает typed-ответ `{ status: 'ok', service: 'api' }` от backend foundation и явно отображает успешный статус без обращения к `PostgreSQL`, `backoffice-bot` и административным use case.

## Обязательные контуры `FEATURE-001`

| Контур | Обязателен в `FEATURE-001` | Что должно появиться в first slice |
| --- | --- | --- |
| `apps/api` | Да | `NestJS` bootstrap, минимальная config-инициализация, CORS для backoffice-web и endpoint `GET /api/foundation/health`. |
| `apps/backoffice-web` | Да | Минимальный shell c root route `/`, который вызывает foundation endpoint и показывает результат. |
| `packages/shared-types` | Да | Typed DTO для foundation smoke-контракта `client -> server`; ручное дублирование формы ответа недопустимо. |
| `infra/` | Да | Локальный/test runtime только для `api + backoffice-web`, env templates и smoke-маршрут foundation-среза. |
| `.github/workflows` | Да | Pipeline validation install/test/build для foundation-среза без обязательного подключения bot/runtime следующей фичи. |
| `apps/backoffice-bot` | Нет | Стартует вместе с `FEATURE-002`, когда появляется Telegram entrypoint и session bootstrap. |
| `PostgreSQL` / `Prisma` | Нет | Подключаются в первой feature, где реально появляется persistence или bootstrap administrator; `FEATURE-001` не должен тащить их как пустую подготовку. |

## Точки входа и конфигурация `FEATURE-001`

- `apps/api/src/main.ts` поднимает HTTP runtime на `API_PORT`.
- `apps/api` публикует только `GET /api/foundation/health`; добавление auth/session, menu, users или slot endpoints в `FEATURE-001` запрещено.
- `apps/backoffice-web/src/main.ts` поднимает foundation shell; root route `/` использует `VITE_API_BASE_URL` для вызова backend foundation.
- `API_CORS_ALLOWED_ORIGIN` задаёт origin, с которого `apps/backoffice-web` может вызывать `apps/api` в local/test runtime.
- `packages/shared-types` экспортирует foundation DTO и используется обеими сторонами связки `client -> server`.

## Явно вне scope `FEATURE-001`

- `apps/backoffice-bot`, Telegram Bot API, Telegram WebApp init data и любые runtime-решения для штатного Telegram-входа.
- `DISABLE_TG_AUTH`, `ADMIN_TELEGRAM_ID`, `TG_BACKOFFICE_BOT_TOKEN`, `DATABASE_URL`, Prisma schema/migrations и любая инициализация persistence.
- Административные use case `auth-session`, `menu-management`, `user-access-management`, `slot-settings`, route guards и role-aware layout.
- Customer- и barista-контуры, а также любые shared-пакеты кроме `packages/shared-types`.

## Smoke path `FEATURE-001`

1. Запускается `apps/api` с конфигурацией `API_PORT` и `API_CORS_ALLOWED_ORIGIN`.
2. Запускается `apps/backoffice-web` с `VITE_API_BASE_URL`, указывающим на `apps/api`.
3. Smoke открывает root route `/` backoffice-web в `local` или lightweight `test` runtime.
4. Frontend выполняет `GET /api/foundation/health`, получает `200 OK` и тело `{ status: 'ok', service: 'api' }`.
5. UI отображает успешный ответ; отсутствие `backoffice-bot`, auth/session и `PostgreSQL` не считается дефектом этого feature-slice.
