# QA Access Application Map

## Граница

Проверки `FEATURE-001`: administrator открывает backoffice через служебного Telegram-бота, bootstrap administrator идемпотентен, role guard работает для вкладок и прямых путей, test-mode исключение ограничено test environment.

## Обязательные уровни проверок

| Уровень | Что проверять |
|---|---|
| Unit | Bootstrap administrator, config validation, role guard matrix. |
| Integration | Telegram auth flow, test-mode auth flow, отказ без Telegram в production-like режиме. |
| E2E | Открытие backoffice administrator через служебный Telegram entrypoint и доступность разрешённых вкладок. |
| Smoke | Сборка и запуск затронутых backend/frontend/runtime контуров. |

## Regression acceptance для FEATURE-006

- После code style/code architecture рефакторинга повторяются acceptance scenarios этой карты без изменения expected behavior.
- Обязательное evidence: server-driven `AuthenticatedActor`, role-based navigation, forbidden screen, production отказ без Telegram, test-mode bypass только при `NODE_ENV=test DISABLE_TG_AUTH=true`.
- Рефакторинг не принимается, если изменились auth headers/body, capability matrix, `401`/`403` mapping или production запрет test-mode.
- QA использует `docs/system/contracts/backoffice-auth-and-capability-access.md` как источник истины и не восстанавливает expected behavior из `frontend/src/*` или `backend/src/*`.

## Текущее расположение проверок

- `backend/test/bootstrap-administrator.spec.ts` — unit evidence для идемпотентного bootstrap administrator.
- `backend/test/access-config.spec.ts` — unit evidence для env/config validation и запрета `DISABLE_TG_AUTH=true` вне `NODE_ENV=test`.
- `backend/test/backoffice-auth.spec.ts` — integration evidence для Telegram/test-mode auth service.
- `backend/test/backoffice-role-guard.spec.ts` — integration evidence для матрицы role guard по capabilities.
- `backend/test/backoffice-entry.e2e.spec.ts` — e2e/regression evidence для `Telegram entry -> session -> capability access` и production-like отказа без Telegram.
- `frontend/src/modules/auth/session-api.spec.ts`, `frontend/src/router/guards.spec.ts`, `frontend/src/modules/navigation/tabs.spec.ts` — frontend contract/navigation evidence для bootstrap, guard и role-aware tab visibility.

## Handoff route for FEATURE-001

- QA читает `docs/system/contracts/backoffice-auth-and-capability-access.md` как канонический источник по `401`/`403`, request boundary и capability guard, затем `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, после этого `frontend-backoffice.md`, `backend-access.md` и `delivery-and-runtime.md`.
- E2E и integration checks не должны опираться на чтение `frontend/src/*` или `backend/src/*`, чтобы восстановить состав `AuthenticatedActor`, test-mode fallback или набор capability.

## Acceptance scenarios

- При первом запуске создаётся пользователь `ADMIN_TELEGRAM_ID` с ролью `administrator`.
- При повторном запуске пользователь и роль не дублируются.
- Administrator через служебный Telegram-бот видит `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- Прямой production URL без Telegram не открывает backoffice.
- В test environment при `DISABLE_TG_AUTH=true` backoffice доступен для проверочного administrator flow.
- Значение `DISABLE_TG_AUTH=true` не принимается как рабочий production bypass.
