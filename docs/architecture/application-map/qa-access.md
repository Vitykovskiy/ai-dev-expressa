# QA Access Application Map

## Граница

Проверки access-контура: administrator открывает backoffice через служебного Telegram-бота, bootstrap administrator идемпотентен, role guard работает для вкладок и прямых путей, test-mode исключение ограничено test environment, управление ролями пользователей проходит через серверный guard.

## Обязательные уровни проверок

| Уровень     | Что проверять                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Unit        | Bootstrap administrator, config validation, role guard matrix.                                           |
| Integration | Telegram auth flow, test-mode auth flow, отказ без Telegram в production-like режиме.                    |
| E2E         | Открытие backoffice administrator через служебный Telegram entrypoint и доступность разрешённых вкладок. |
| Smoke       | Сборка и запуск затронутых backend/frontend/runtime контуров.                                            |

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
- `backend/test/backoffice-entry.integration.spec.ts` — integration/regression evidence для `Telegram entry -> session -> capability access` и production-like отказа без Telegram.
- `frontend/src/modules/auth/session-api.spec.ts`, `frontend/src/router/guards.spec.ts`, `frontend/src/modules/navigation/tabs.spec.ts` — frontend contract/navigation evidence для bootstrap, guard и role-aware tab visibility.
- Для FEATURE-004 ожидаются backend unit/integration checks в `backend/test/user-role-management*.spec.ts`, frontend checks в `frontend/src/modules/users/*.spec.ts` и browser e2e checks в `e2e/access/administrator-user-role-*.spec.ts` с явным mapping на `F004-*`.

## Handoff route for FEATURE-001

- QA читает `docs/system/contracts/backoffice-auth-and-capability-access.md` как канонический источник по `401`/`403`, request boundary и capability guard, затем `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, после этого `frontend-backoffice.md`, `backend-access.md` и `delivery-and-runtime.md`.
- E2E и integration checks не должны опираться на чтение `frontend/src/*` или `backend/src/*`, чтобы восстановить состав `AuthenticatedActor`, test-mode fallback или набор capability.

## Handoff route for FEATURE-004

- Manual QA читает `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `behavior.md`, `ui-behavior.md`, `test-scenarios.md`, `docs/architecture/qa-standards.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx` и `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`.
- E2E QA читает `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`, `test-scenarios.md`, `docs/architecture/qa-standards.md`, `frontend-backoffice.md`, `backend-access.md` и `delivery-and-runtime.md`.
- Manual QA закрывает пользовательский сценарий, UI parity и defect triage по `F004-SC-001` ... `F004-SC-008`.
- E2E QA покрывает required scenarios `F004-SC-001`, `F004-SC-003`, `F004-SC-004`, `F004-SC-005`, `F004-SC-006` и `F004-SC-007`; optional scenarios `F004-SC-002` и `F004-SC-008` покрываются при наличии устойчивых селекторов и данных.
- Финальный e2e evidence выполняется командой `npm run test:e2e` против опубликованного `test-e2e` route, если QA-задача не фиксирует обоснованный локальный override.
- Backend endpoint evidence для role-management API может подтверждать contract feedback, но не заменяет browser e2e acceptance required scenarios.

## Handoff route for FEATURE-005

- Manual QA читает `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`, `behavior.md`, `ui-behavior.md`, `test-scenarios.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md` и `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`.
- E2E QA читает `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`, `test-scenarios.md`, `docs/architecture/qa-standards.md`, `frontend-backoffice.md`, `backend-access.md` и `delivery-and-runtime.md`.
- Manual QA закрывает required scenarios `FEATURE-005-SC-001`, `FEATURE-005-SC-002` и `FEATURE-005-SC-005`; optional scenarios `FEATURE-005-SC-003` и `FEATURE-005-SC-004` выполняются при наличии устойчивого route and data.
- E2E QA покрывает required scenarios `FEATURE-005-SC-001`, `FEATURE-005-SC-002` и `FEATURE-005-SC-003`; optional scenarios `FEATURE-005-SC-004` и `FEATURE-005-SC-005` покрываются при наличии устойчивого route and data.
- Финальный e2e evidence выполняется командой `npm run test:e2e` против опубликованного `test-e2e` route, если QA-задача не фиксирует обоснованный локальный override.
- Backend endpoint evidence для `PATCH /backoffice/user-management/users/:userId/block` может подтверждать contract feedback, но не заменяет browser e2e acceptance required scenarios.

## FEATURE-005 QA actor and data route

- QA target uses the published `test-e2e` stand or a local override only when backend test-mode is enabled by `NODE_ENV=test DISABLE_TG_AUTH=true`.
- Administrator actor uses the existing test-mode route with `ADMIN_TELEGRAM_ID` or `E2E_TEST_TELEGRAM_ID` mapped to an `administrator` user; direct setup calls pass this actor through `testTelegramId` or `x-test-telegram-id`.
- Target user for `FEATURE-005-SC-001` and `FEATURE-005-SC-002` uses a distinct non-secret Telegram identifier owned by QA evidence or QA fixtures, is authenticated through the existing test-mode session route, and is resolved to `userId` through `GET /backoffice/user-management/users`.
- Target user must have protected application access before the block check; if the target has no such access, QA prepares it through the existing role-management route by assigning `barista` before the block and records that as setup, not as `FEATURE-005` acceptance.
- Non-administrator actor for `FEATURE-005-SC-003` uses a second distinct test-mode Telegram identifier without role `administrator`; the actor may be a plain customer or a `barista`, but must not receive `administrator`.
- Block operation for acceptance is initiated through the users surface; e2e setup and state verification may use the documented backend proxy route `PATCH /backoffice/user-management/users/:userId/block` with administrator test-mode auth.
- Blocked-user access attempt uses the target user's test-mode identity after `blocked=true` and verifies denial at a protected boundary, such as `POST /backoffice/auth/session` or `GET /backoffice/orders` through the published `/backoffice/*` proxy with `x-test-telegram-id`.
- `FEATURE-005-SC-003` verifies the non-administrator block attempt through the documented block operation boundary and then confirms the target user was not newly blocked by that attempt.
- If the existing test-mode auth and user-management routes cannot materialize, expose or reuse the distinct target/non-administrator actors described above, QA-013 creates a backend-owner resolver or `BUG-*` under `FEATURE-005` instead of returning a hard blocker.
- `FEATURE-005` does not require a new runtime variable, deployment route, VPS stand or `DO-*` task at architecture handoff time.

## Acceptance scenarios

### FEATURE-001

- При первом запуске создаётся пользователь `ADMIN_TELEGRAM_ID` с ролью `administrator`.
- При повторном запуске пользователь и роль не дублируются.
- Administrator через служебный Telegram-бот видит `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- Прямой production URL без Telegram не открывает backoffice.
- В test environment при `DISABLE_TG_AUTH=true` backoffice доступен для проверочного administrator flow.
- Значение `DISABLE_TG_AUTH=true` не принимается как рабочий production bypass.

### FEATURE-004

- `F004-SC-001`: administrator видит вкладку `Пользователи` и список пользователей или empty state.
- `F004-SC-003`: administrator назначает целевому пользователю роль `barista`.
- `F004-SC-004`: целевой пользователь после назначения `barista` видит только вкладки `Заказы` и `Доступность`, а прямой переход на administrator-only route получает отказ.
- `F004-SC-005`: пользователь без роли `administrator` не видит вкладку `Пользователи`, не проходит прямой route guard и получает отказ operation boundary назначения роли.
- `F004-SC-006`: недопустимая назначаемая роль отклоняется, а роли target user остаются без изменений.
- `F004-SC-007`: обычный administrator получает `main-administrator-required` при назначении `administrator`, а главный administrator успешно назначает роль `administrator`.
- `F004-SC-008`: manual QA подтверждает parity вкладки `Пользователи`, меню `Назначить роль` и диалога выбора ролей с `.references/Expressa_admin`.

### FEATURE-005

- `FEATURE-005-SC-001`: administrator блокирует существующего target user через users surface, видит success state, а users representation показывает `blocked`.
- `FEATURE-005-SC-002`: target user с `blocked=true` не получает доступ к защищенному application surface, при этом administrator access остается рабочим.
- `FEATURE-005-SC-003`: actor без роли `administrator` не может выполнить block operation, а target user state не меняется.
- `FEATURE-005-SC-004`: отсутствующий target user возвращает или показывает `user-not-found` без success confirmation.
- `FEATURE-005-SC-005`: acceptance `FEATURE-005` не требует `unblock_user` и не считает unblock частью закрытия feature.
