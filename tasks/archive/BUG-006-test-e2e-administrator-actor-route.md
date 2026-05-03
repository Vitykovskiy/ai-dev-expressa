# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-006`
- Родительская задача: `FEATURE-008`
- Заголовок: `test-e2e stand does not provide administrator actor for browser acceptance`
- Единица поставки: `FEATURE-008`
- Роль: `Девопс`
- Метка контура причины: `devops`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`; `docs/architecture/application-map/qa-access.md`
- Приоритет: `Высокий`
- Статус: `Ожидает тестирования`

## Цель

`Восстановить опубликованный test-e2e route так, чтобы QA-owned Playwright suite мог получить administrator actor через документированный test-mode путь без внешнего секрета или production account.`

## Границы задачи

### Behavioral Requirements

- Система должна предоставлять administrator actor на `https://expressa-e2e-test.vitykovskiy.ru` для канонического e2e route `npm run test:e2e`.
- Система должна сохранять `NODE_ENV=test` и `DISABLE_TG_AUTH=true` как test-mode runtime boundary для стенда `test-e2e`.
- Система должна сохранять public API contracts и auth semantics.
- Система должна зафиксировать используемый administrator Telegram id в runtime/QA handoff без коммита секретов.

### Scope Constraints

- Исправление относится к runtime/env/test-data route стенда `test-e2e`.
- Изменение frontend production code находится вне области задачи.
- Изменение backend production behavior находится вне области задачи.
- Изменение системных контрактов находится вне области задачи.

### Safety Constraints

- Система должна сохранять запрет production-like bypass вне `NODE_ENV=test`.
- Система должна хранить runtime secrets и env values вне репозитория.

## Зона ответственности

### Разрешенная зона правок

- `.github/workflows/**`
- `docker-compose.deploy.yml`
- `scripts/deploy-test-vps.sh`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `tasks/BUG-006-test-e2e-administrator-actor-route.md`
- runtime/env handoff artifacts без секретных значений

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- unversioned env files and secrets

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/qa-access.md`
- `tasks/QA-011-e2e-tooling-first-regression.md`

## Результат готовности

`BUG-006 закрыт, когда published test-e2e route возвращает actor с role administrator и capabilities orders, availability, menu, users, settings для документированного QA e2e actor route, после чего QA-011 может повторить npm run test:e2e.`

## Проверки

- `POST https://expressa-e2e-test.vitykovskiy.ru/backoffice/auth/session` возвращает administrator actor через документированный test-mode route.
- `npm run test:e2e` повторно запущен в `QA-011` после исправления route.

## Результат выполнения

Дата проверки: `2026-05-02`

Resolver `R05-bug-006-test-e2e-runtime-actor-route` выполнил focused route probe опубликованного `test-e2e` стенда:

- `POST https://expressa-e2e-test.vitykovskiy.ru/backoffice/auth/session` с empty JSON возвращает actor `telegramId: "1"`, `roles: ["barista"]`, `capabilities: ["orders","availability"]`.
- `POST https://expressa-e2e-test.vitykovskiy.ru/backoffice/auth/session` с `testTelegramId` `1001`, `123456789`, `777008` и `2002` возвращает `403`.
- `GET https://expressa-e2e-test.vitykovskiy.ru/backoffice/orders` с `x-test-telegram-id` `1001`, `123456789`, `777008` и `2002` возвращает `403`.

Hard blocker:

- Published `test-e2e` runtime state не предоставляет administrator actor route для QA-owned Playwright suite.
- Исправление требует изменения внешнего VPS env/test-data state или секретов стенда `test-e2e`, которые находятся вне репозитория и не могут быть заменены versioned изменением без доступа к внешнему runtime.
- Репозиторий уже содержит env-driven deploy contract: `test-e2e` обязан запускать backend с `NODE_ENV=test`, `DISABLE_TG_AUTH=true` и внешним `ADMIN_TELEGRAM_ID`; фактическое значение `ADMIN_TELEGRAM_ID` и состояние опубликованного стенда не коммитятся.

`P06-e2e-qa` остается заблокированной до обновления внешнего `test-e2e` runtime/env state и повторного focused probe, подтверждающего actor `administrator` с capabilities `orders`, `availability`, `menu`, `users`, `settings`.

Дата подготовки: `2026-05-03`

Resolver `R07-test-e2e-vps-runtime-env-preparation` подготовил runtime/test-data state опубликованного `test-e2e` стенда через существующий env-driven Docker Compose contract без изменения production-кода, e2e-тестов, versioned env-файлов и без вывода секретов.

Focused route probe после подготовки:

- `POST https://expressa-e2e-test.vitykovskiy.ru/backoffice/auth/session` с empty JSON возвращает actor `roles: ["administrator"]`, `capabilities: ["orders","availability","menu","users","settings"]`.

Full `npm run test:e2e` внутри resolver не запускался. Следующий шаг: `R08-focused-e2e-route-recheck` должен подтвердить route и вернуть `P06-e2e-qa` к повторному QA-owned e2e прогону.

Дата повторной focused-проверки: `2026-05-03`

Resolver `R08-focused-e2e-route-recheck` подтвердил опубликованный route:

- `POST https://expressa-e2e-test.vitykovskiy.ru/backoffice/auth/session` возвращает actor `roles: ["administrator"]`, `capabilities: ["orders","availability","menu","users","settings"]`.
- Полный `npm run test:e2e` внутри R08 не запускался; повторный canonical browser e2e прогон остается за `QA-011`.
