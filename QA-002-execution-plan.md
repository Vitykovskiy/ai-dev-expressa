# QA-002 Execution Plan

## Task

- Task card: `tasks/QA-002-feature-004-e2e-user-role-management.md`
- Parent feature: `FEATURE-004`
- Lane: `E2E QA`
- Status: `completed`

## Source Route

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/QA-002-feature-004-e2e-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

## Source Gaps

- `FEATURE-004-context-06-qa-e2e-user-role-management.md` is listed in the task card, but is absent from the working tree.

## Scope Constraints

- Work is limited to QA-owned browser e2e coverage, fixtures, assertions, and QA evidence for `FEATURE-004`.
- Required e2e scenario IDs are `FTS-004-001`, `FTS-004-002`, `FTS-004-005`, `FTS-004-006`, `FTS-004-007`, and `FTS-004-008`.
- `FTS-004-003`, `FTS-004-004`, and `FTS-004-009` remain outside the mandatory e2e lane.
- The work does not expand scope to `block_user` or `unblock_user`.

## Subtasks

- [x] `QA-002-ST-01` Inventory current e2e helpers, runtime assumptions, and required selectors/API routes for the users flow.
- [x] `QA-002-ST-02` Add or update e2e support helpers and fixtures for user role management without changing production code.
- [x] `QA-002-ST-03` Cover `FTS-004-001`, `FTS-004-002`, and `FTS-004-005` in QA-owned Playwright tests.
- [x] `QA-002-ST-04` Cover `FTS-004-006`, `FTS-004-007`, and `FTS-004-008` in QA-owned Playwright tests.
- [x] `QA-002-ST-05` Add QA evidence mapping scenario IDs to test files, test titles, required assertions, and out-of-lane scenarios.
- [x] `QA-002-ST-06` Run `npm run test:e2e` and record the result in QA evidence.

## ST-01 Inventory

### Existing e2e structure

- QA-owned browser e2e lives in `e2e/` with Playwright config in `e2e/playwright.config.ts`.
- Root command `npm run test:e2e` delegates to `npm --prefix e2e test --`; `e2e/package.json` runs `playwright test`.
- Existing scenario groups:
  - `e2e/access/*` covers FEATURE-001 auth/bootstrap/guard flows and provides `e2e/access/support/access-helpers.ts`.
  - `e2e/menu-catalog/*` covers FEATURE-002 menu flows and provides API/UI/auth helpers under `e2e/menu-catalog/support/`.
  - `e2e/slot-settings/*` covers FEATURE-003 settings flows and provides API/UI/auth/lock helpers under `e2e/slot-settings/support/`.
- No `e2e/user-management/` suite or user-management-specific support helpers exist yet.

### Runtime assumptions

- Playwright `baseURL` defaults to `https://expressa-e2e-test.vitykovskiy.ru` and can be overridden through `E2E_BASE_URL`.
- Browser tests use Desktop Chrome only.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` can override the Chromium executable and adds `--no-sandbox`.
- `E2E_TEST_TELEGRAM_ID` is used by existing API helpers as a test-mode actor id.
- Existing default test ids are inconsistent across helpers:
  - `e2e/access/support/access-helpers.ts` uses fixture actors with telegram ids `1001` and `2002`.
  - `e2e/menu-catalog/support/menu-catalog-api.ts` defaults administrator id to `1001`.
  - `e2e/slot-settings/support/slot-settings-api.ts` defaults administrator id to `123456789`.
- `E2E_BACKEND_BASE_URL` is currently used by slot-settings helpers for direct JSON calls; menu-catalog helpers rely on Playwright `baseURL`.
- Published `test-e2e` route exposes `/backoffice/*` through the frontend origin proxy, so FEATURE-004 API helpers can use relative `/backoffice/users` paths unless a direct backend override is deliberately added.

### Reusable helper patterns

- Scenario annotations are implemented in `e2e/access/support/access-helpers.ts` and duplicated in `e2e/menu-catalog/admin-menu-catalog-api.spec.ts`.
- `mockSessionBootstrap` in access/menu helpers intercepts `**/backoffice/auth/session` and can model administrator, barista, 401 and 403 session outcomes.
- `expectHiddenTabs` and tab visibility assertions already exist for role-based navigation.
- API helper pattern from `e2e/menu-catalog/support/menu-catalog-api.ts`:
  - ensure a session through `POST /backoffice/auth/session`;
  - send `x-test-telegram-id`;
  - assert JSON `message` for business/transport errors.
- UI helper pattern from `e2e/menu-catalog/support/menu-catalog-ui.ts` uses accessible roles/text first and element ids for form fields where available.

### FEATURE-004 selectors and UI anchors

- Route: `/users`.
- Navigation tab: link name `Пользователи`.
- Users screen heading: exact heading `Пользователи`.
- Search buttons: icon buttons with title/name `Поиск`.
- Search field placeholder: `Поиск по имени или Telegram`.
- Primary entrypoint button: `Добавить пользователя`; disabled while loading or when the users list is empty.
- Empty state: title `Пользователей нет`, subtitle `Они появятся после активации бота`.
- List row anchors: user `displayName`, `telegramUsername`, role badge text and status badge text.
- Row action button title: `Действия пользователя`; menu item title/text: `Назначить роль`.
- Dialog heading/title: `Новый пользователь`; description `Выберите пользователя и назначьте роль`.
- Dialog field ids:
  - `#users-dialog-user`
  - `#users-dialog-name`
  - `#users-dialog-telegram`
  - `#users-dialog-role`
- Dialog submit button: `Добавить пользователя`; cancel button: `Отмена`.
- Success feedback uses snackbar text from `userRoleAssignmentSuccessMessage`.
- Forbidden direct-route state uses URL `/forbidden`, visible `403`, and heading `Доступ к этой вкладке запрещён`.

### Required API routes

- Session bootstrap: `POST /backoffice/auth/session`.
- Users list: `GET /backoffice/users`.
- Users list query parameters in scope: `search`, `role=barista`, `blocked=true`.
- Assign role: `PATCH /backoffice/users/{userId}/role` with body `{ "role": "barista" | "administrator" }`.
- Auth/test-mode headers for direct API calls: `x-test-telegram-id`; frontend API also supports `x-telegram-init-data` when Telegram init data is present.
- Required error assertions:
  - `403` + `backoffice-capability-forbidden` or `administrator-role-required` for non-admin assignment access.
  - `403` + `administrator-role-assignment-forbidden` for ordinary administrator assigning `administrator`.
  - `422` + `role-not-assignable` for invalid assignable role.

### ST-02 handoff notes

- Add a dedicated `e2e/user-management/` support layer instead of changing production code.
- Prefer reusing or centralizing access helper patterns to avoid further default actor drift.
- Fixtures must support at least three actors: `BootstrapAdministrator`, ordinary `administrator`, and non-admin `barista`.
- Fixtures must support user snapshots with `availableRoleAssignments` differing by actor.
- Tests that require invalid role submission can use direct API calls or route interception because the UI select is server-driven and normally prevents unsupported values.
- Keep `block_user` and `unblock_user` out of helpers and assertions for QA-002.

## ST-05 QA Evidence Mapping

### Required e2e coverage

| Scenario ID   | Test file                                                | Test title                                                                         | Required assertions covered                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FTS-004-001` | `e2e/user-management/admin-user-role-assignment.spec.ts` | `FTS-004-001 users screen and role assignment entrypoint`                          | Administrator session reaches `/users`; heading `Пользователи` is visible; administrator tabs include `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`; user row shows `displayName`, `telegramUsername`, role badge `Клиент`, status badge `Активен`; `Добавить пользователя` is enabled; mocked `GET /backoffice/users` is observed.                                                         |
| `FTS-004-002` | `e2e/user-management/admin-user-role-assignment.spec.ts` | `FTS-004-002 assign barista role`                                                  | Assignment dialog opens from users screen; `PATCH /backoffice/users/{userId}/role` is sent with `role=barista`; response is successful; response body contains `roles=["customer","barista"]` and barista `backofficeAccess.capabilities`; success notification `Роль пользователя обновлена` is visible; updated role badge `Бариста` is visible.                                                         |
| `FTS-004-005` | `e2e/user-management/admin-user-role-assignment.spec.ts` | `FTS-004-005 invalid assignable role`                                              | Direct role assignment request sends unsupported `role=customer`; response status is `422`; response body message is `role-not-assignable`; success notification is absent; user row remains visible with unchanged `Клиент` role.                                                                                                                                                                         |
| `FTS-004-006` | `e2e/user-management/admin-user-role-assignment.spec.ts` | `FTS-004-006 role assignment access guard`                                         | Non-admin actor reaches forbidden route state; hidden tabs include `Меню`, `Пользователи`, `Настройки`; direct assignment request returns `403`; response body message is `backoffice-capability-forbidden`; attempted patch is recorded without role-change success.                                                                                                                                      |
| `FTS-004-007` | `e2e/user-management/admin-user-role-assignment.spec.ts` | `FTS-004-007 assign administrator role by bootstrap administrator`                 | BootstrapAdministrator opens users screen and assignment dialog; role `Администратор` is selected; `PATCH /backoffice/users/{userId}/role` is sent with `role=administrator`; response is successful; response body contains `roles=["customer","administrator"]` and administrator `backofficeAccess.capabilities`; success notification is visible; `administrator-role-assignment-forbidden` is absent. |
| `FTS-004-008` | `e2e/user-management/admin-user-role-assignment.spec.ts` | `FTS-004-008 forbid administrator role assignment for non-bootstrap administrator` | Ordinary administrator opens users screen and assignment dialog; role `Администратор` is selected; `PATCH /backoffice/users/{userId}/role` is sent with `role=administrator`; response status is `403`; response body message is `administrator-role-assignment-forbidden`; success notification is absent; user row remains visible with unchanged `Клиент` role.                                         |

### Out-of-lane scenarios

| Scenario ID   | E2E lane status            | Evidence                                                                                                                                                                                                       |
| ------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FTS-004-003` | outside mandatory e2e lane | Scenario is marked `E2E QA: optional` in `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`; QA-002 required scope does not require search/filter browser coverage.  |
| `FTS-004-004` | outside mandatory e2e lane | Scenario is marked `E2E QA: optional` in `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`; QA-002 required scope does not require empty-state browser coverage.    |
| `FTS-004-009` | outside mandatory e2e lane | Scenario is marked `E2E QA: n/a` in `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`; QA-002 keeps `block_user` and `unblock_user` outside the mandatory e2e lane. |

### Run evidence status

- `QA-002-ST-06` full suite run completed on `2026-04-24`.
- Command: `npm.cmd run test:e2e` from repository root. This is the Windows PowerShell-compatible invocation of canonical `npm run test:e2e`; direct `npm` was blocked by local PowerShell script execution policy for `npm.ps1`.
- Route: default Playwright published `test-e2e` route from `e2e/playwright.config.ts`, `https://expressa-e2e-test.vitykovskiy.ru`.
- Result: `31 passed (47.2s)`.
- FEATURE-004 evidence in the full run:
  - `FTS-004-001 users screen and role assignment entrypoint` passed.
  - `FTS-004-002 assign barista role` passed.
  - `FTS-004-005 invalid assignable role` passed.
  - `FTS-004-006 role assignment access guard` passed.
  - `FTS-004-007 assign administrator role by bootstrap administrator` passed.
  - `FTS-004-008 forbid administrator role assignment for non-bootstrap administrator` passed.

## Execution Protocol

- The main agent invokes one subagent at a time.
- Each subagent takes the next unchecked subtask from this plan.
- After a subagent completes its work, the main agent sends: `Отметь подзадачу выполненной`.
- The cycle repeats until every subtask is checked.
