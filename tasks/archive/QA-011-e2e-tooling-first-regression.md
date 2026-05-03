# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-011`
- Родительская задача: `FEATURE-008`
- Заголовок: `E2E tooling-first regression`
- Единица поставки: `FEATURE-008`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`; `docs/architecture/application-map/qa-menu-catalog.md`; `docs/architecture/application-map/qa-slot-settings.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

`Обновить при необходимости и выполнить browser e2e regression suite после tooling-first alignment с mapping на stable scenario IDs затронутых фич.`

## Границы задачи

### Behavioral Requirements

- Система должна использовать Playwright как штатный e2e-инструмент для browser regression.
- Система должна запускать e2e suite через каноническую команду `npm run test:e2e`.
- Система должна связывать e2e evidence с stable scenario IDs из feature test scenarios.
- Система должна использовать shared e2e fixtures/helpers в `support/`, если helper нужен нескольким spec-файлам одного контура.
- Система должна фиксировать воспроизводимые дефекты как `BUG-*` с явной меткой контура причины.

### Назначенные инструменты и официальная документация

- Playwright tests: `https://playwright.dev/docs/intro`
- Playwright fixtures: `https://playwright.dev/docs/test-fixtures`
- Playwright best practices: `https://playwright.dev/docs/best-practices`

### Scope Constraints

- Задача охватывает QA-owned browser e2e tests, fixtures, reports, evidence и defect handoff.
- Изменение frontend production code, backend production code, runtime/deployment route, system contracts и approved UI source находится вне области задачи.

### Safety Constraints

- E2E QA не заменяет ручную приемку UI parity из `QA-010`.
- E2E QA не утверждает новое поведение по фактическому production-коду.
- E2E QA фиксирует blocker, если scenario IDs или expected assertions отсутствуют в назначенных источниках.

## Зона ответственности

### Разрешенная зона правок

- `e2e/**`
- `tasks/QA-011-e2e-tooling-first-regression.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов, найденных при e2e regression

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `.github/**`
- `scripts/**`
- `docs/system/**`
- `docs/architecture/**`
- `docs/business/**`
- `.references/**`

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `https://playwright.dev/docs/intro`

## Справочные ссылки

- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `https://playwright.dev/docs/test-fixtures`
- `https://playwright.dev/docs/best-practices`

## Результат готовности

`E2E QA выполняет browser regression suite через npm run test:e2e, фиксирует pass/fail evidence и mapping между stable scenario IDs, test files, test titles и required assertions.`

## Проверки

- `npm run test:e2e`
- Coverage mapping должен перечислять затронутые scenario IDs, test files, test titles и required assertions.
- Проверить, что новые или измененные helpers находятся в `e2e/**/support/**`, если используются несколькими spec-файлами.

## Результат выполнения

Дата проверки: `2026-05-02`

E2E suite запущен через Playwright штатным маршрутом.

Evidence:

- `npm run test:e2e` против canonical `https://expressa-e2e-test.vitykovskiy.ru`: `16 passed`, `15 failed`.
- Повторный запуск с `E2E_TEST_TELEGRAM_ID=123456789 npm run test:e2e`: `16 passed`, `15 failed`.
- Playwright evidence: `e2e/test-results/**`, `e2e/playwright-report/**`.

Coverage mapping проверен по существующим browser spec:

| Scenario IDs                                                                             | Test file                                           | Test title / titles                                                                                                                                                                                                                                                                 | Required assertions                                                                        |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `FTS-001-001`, `FTS-001-002`, `FTS-001-007`                                              | `e2e/access/administrator-access-bootstrap.spec.ts` | `FTS-001-001 Telegram bootstrap creates administrator session`; `FTS-001-002 test-mode bootstrap succeeds in test environment`; `FTS-001-002 production-like bootstrap rejection resolves to entry-denied`; `FTS-001-007 repeated bootstrap preserves the same authenticated actor` | administrator session, test-mode availability, production-like rejection, idempotent actor |
| `FTS-001-003`, `FTS-001-004`                                                             | `e2e/access/administrator-access-guards.spec.ts`    | visible tabs and direct route guard tests                                                                                                                                                                                                                                           | role-derived tabs, forbidden state, entry-denied state                                     |
| `FTS-001-005`, `FTS-001-006`                                                             | `e2e/access/administrator-access-denial.spec.ts`    | missing/invalid entry and denied user tests                                                                                                                                                                                                                                         | entry-denied, blocked/roleless denial, hidden shell                                        |
| `F004-SC-001`, `F004-SC-003`, `F004-SC-004`, `F004-SC-005`, `F004-SC-006`, `F004-SC-007` | `e2e/access/administrator-user-role-*.spec.ts`      | users list, role assignment, access, API boundary tests                                                                                                                                                                                                                             | users visibility, role assignment, recalculated access, guard and validation errors        |
| `FTS-002-001` ... `FTS-002-009`, `FTS-002-011`                                           | `e2e/menu-catalog/admin-menu-catalog-*.spec.ts`     | menu save, validation and API contract tests                                                                                                                                                                                                                                        | category/product/option group flows, validation errors, guard/API refusal                  |
| `FTS-003-001` ... `FTS-003-006`                                                          | `e2e/slot-settings/admin-slot-settings-*.spec.ts`   | settings save, validation, access and slot generation tests                                                                                                                                                                                                                         | save feedback, validation states, guard, generated slot effect                             |

Shared helper location check: reused helpers are under `e2e/access/support/**`, `e2e/menu-catalog/support/**`, `e2e/slot-settings/support/**`.

Blocker:

- Published `test-e2e` route does not provide the administrator acceptance actor expected by the browser suite. The first failing assertion shows `/backoffice/auth/session` returns `roles: ["barista"]` and capabilities `["orders","availability"]` where administrator scenarios require `roles: ["administrator"]` and `["orders","availability","menu","users","settings"]`.
- The same failure remains when using the documented `E2E_TEST_TELEGRAM_ID=123456789` QA override.
- Downstream failures in users, menu and settings routes are consistent with missing administrator capabilities, so QA cannot close feature-level e2e acceptance from this run.

No `BUG-*` task created in this step because the current evidence identifies an e2e acceptance-route/test-data blocker, not a proven product defect in frontend, backend or devops contour.

Resolver `R04-e2e-acceptance-actor-route` evidence:

- QA-owned route inspection found inconsistent e2e actor defaults across support helpers: empty session payload, `1001`, and `123456789` are used by different browser/API helpers.
- Direct published-route probe showed `POST /backoffice/auth/session` with empty JSON returns `telegramId: "1"`, `roles: ["barista"]`, `capabilities: ["orders","availability"]`.
- Direct published-route probe showed `testTelegramId` values `1001`, `123456789`, `94004002`, `777008`, and `2002` return `403` on the published `test-e2e` route.
- QA cannot resolve this inside `e2e/**` because no documented administrator actor is available through the published runtime/test-data route.
- Created `tasks/BUG-006-test-e2e-administrator-actor-route.md` with contour `devops`.

Дата повторной focused-проверки route: `2026-05-03`

Resolver `R08-focused-e2e-route-recheck` выполнил только focused probe опубликованного `test-e2e` route:

- `POST https://expressa-e2e-test.vitykovskiy.ru/backoffice/auth/session` возвращает actor `roles: ["administrator"]`, `capabilities: ["orders","availability","menu","users","settings"]`.
- Полный `npm run test:e2e` внутри R08 не запускался.
- `P06-e2e-qa` возвращена в `pending` для повторного QA-owned canonical browser e2e прогона.

Дата повторного e2e-прогона: `2026-05-03`

Evidence после R08:

- `npm run test:e2e` против canonical `https://expressa-e2e-test.vitykovskiy.ru`: `31 passed`.
- Playwright evidence: `e2e/test-results/**`, `e2e/playwright-report/**`.
- Полный browser e2e suite выполнен через штатный Playwright route без `E2E_BASE_URL`, `E2E_BACKEND_BASE_URL` или `E2E_TEST_TELEGRAM_ID` override.

Coverage mapping повторно проверен по существующим browser spec:

| Scenario IDs                                                                             | Test file                                           | Test title / titles                                                                                                                                                                                                                                                                 | Required assertions                                                                        |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `FTS-001-001`, `FTS-001-002`, `FTS-001-007`                                              | `e2e/access/administrator-access-bootstrap.spec.ts` | `FTS-001-001 Telegram bootstrap creates administrator session`; `FTS-001-002 test-mode bootstrap succeeds in test environment`; `FTS-001-002 production-like bootstrap rejection resolves to entry-denied`; `FTS-001-007 repeated bootstrap preserves the same authenticated actor` | administrator session, test-mode availability, production-like rejection, idempotent actor |
| `FTS-001-003`, `FTS-001-004`                                                             | `e2e/access/administrator-access-guards.spec.ts`    | visible tabs and direct route guard tests                                                                                                                                                                                                                                           | role-derived tabs, forbidden state, entry-denied state                                     |
| `FTS-001-005`, `FTS-001-006`                                                             | `e2e/access/administrator-access-denial.spec.ts`    | missing/invalid entry and denied user tests                                                                                                                                                                                                                                         | entry-denied, blocked/roleless denial, hidden shell                                        |
| `F004-SC-001`, `F004-SC-003`, `F004-SC-004`, `F004-SC-005`, `F004-SC-006`, `F004-SC-007` | `e2e/access/administrator-user-role-*.spec.ts`      | users list, role assignment, access, API boundary tests                                                                                                                                                                                                                             | users visibility, role assignment, recalculated access, guard and validation errors        |
| `FTS-002-001` ... `FTS-002-009`, `FTS-002-011`                                           | `e2e/menu-catalog/admin-menu-catalog-*.spec.ts`     | menu save, validation and API contract tests                                                                                                                                                                                                                                        | category/product/option group flows, validation errors, guard/API refusal                  |
| `FTS-003-001` ... `FTS-003-006`                                                          | `e2e/slot-settings/admin-slot-settings-*.spec.ts`   | settings save, validation, access and slot generation tests                                                                                                                                                                                                                         | save feedback, validation states, guard, generated slot effect                             |

Shared helper location check: reused helpers are under `e2e/access/support/**`, `e2e/menu-catalog/support/**`, `e2e/slot-settings/support/**`.

No new `BUG-*` task created in this step because the canonical browser e2e suite passed and no reproducible e2e defect was found.

Дата повторной приемочной проверки после отклонения: `2026-05-03`

Regression failure reproduced:

- `npm run test:e2e` против canonical `https://expressa-e2e-test.vitykovskiy.ru`: `30 passed`, `1 failed`.
- Failed test: `e2e/access/administrator-user-role-list.spec.ts` — `F004-SC-001 administrator sees users list`.
- Причина: QA-owned e2e assertion использовал глобальный `getByText("Активен", { exact: true })`; текущие данные published `test-e2e` route содержат два активных пользователя, поэтому Playwright strict mode получил два совпадения.

QA-owned correction:

- `e2e/access/administrator-user-role-list.spec.ts` теперь находит строку пользователя по точному Telegram id из ответа `/backoffice/user-management/users` и проверяет статус внутри этой строки.
- Product code, runtime route, contracts и system docs не изменялись.

Verification after correction:

- `npm --prefix e2e test -- access/administrator-user-role-list.spec.ts`: `1 passed`.
- `npm run test:e2e` против canonical `https://expressa-e2e-test.vitykovskiy.ru`: `31 passed`.

No new `BUG-*` task created in this step because the reproduced failure was limited to QA-owned e2e locator strictness and was fixed inside `e2e/**`.
