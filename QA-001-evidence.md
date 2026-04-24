# QA-001 Manual QA Evidence

## Карточка evidence

- QA task: `tasks/QA-001-feature-004-manual-user-role-management.md`
- Feature: `FEATURE-004`
- Lane: `manual QA`
- Evidence artifact: `QA-001-evidence.md`
- Scenario source: `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- Feature spec: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- Contract source: `docs/system/contracts/user-role-and-blocking-management.md`
- UI contract: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- UI references: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- Runtime route source: `docs/architecture/application-map/delivery-and-runtime.md`
- Evidence status: `subtask-4-completed-final-blocked`

## Input gaps

| Gap ID           | Source                                                                           | Status    | QA impact                                                    | Handling                                                                                                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QA-001-GAP-001` | `FEATURE-004-context-05-qa-manual-user-role-management.md` from QA task read set | `missing` | The referenced context package is unavailable for this lane. | Gap is recorded here. Manual QA must proceed only from the current task-card, feature spec, test scenarios, contracts, UI contract, architecture maps, and reference files named in `QA-001-execution-plan.md`; archived tasks are not used as substitutes. |

## Manual run context

- Environment under test: `published test-e2e stand`
- Stand URL: `https://expressa-e2e-test.vitykovskiy.ru/users`
- Checked build or commit: `not exposed in UI evidence; published test-e2e stand checked on 2026-04-24`
- Tester: `Codex QA agent`
- Run date: `2026-04-24`
- Auth/test-mode actor data: `test-mode administrator session; POST /backoffice/auth/session -> 201`
- Test data seed or user records: `GET /backoffice/users returned one user: userId=12e53a00-206d-423b-a9b1-c8bd8d7df9f0, displayName=1, roles=[administrator], blocked=false, availableRoleAssignments=[barista, administrator]`
- Subtask 3 contract baseline: `Only the bootstrap administrator target was available on the published test-e2e stand; no separate barista-assignable non-administrator target and no ordinary non-bootstrap administrator actor were available without mutating runtime data outside this subtask.`

## Scenario evidence matrix

| Scenario ID   | Scenario                                                         | Manual status | Defect or blocker    | Evidence notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------- | ------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FTS-004-001` | Users screen and role assignment entrypoint                      | `pass`        | `none`               | Administrator session showed `Пользователи`; `GET /backoffice/users` returned 200 with one observable user; `Добавить пользователя` opened role assignment dialog.                                                                                                                                                                                                                                                                                                                       |
| `FTS-004-002` | Assign `barista` role                                            | `blocked`     | `QA-001-BLOCKER-003` | Published test-e2e stand had only the bootstrap administrator target. Assigning `barista` to that target would not validate the required barista-only recalculated access and would mutate shared runtime data; no suitable target user from the scenario test data was available.                                                                                                                                                                                                       |
| `FTS-004-003` | Search and filter before selecting user                          | `pass`        | `none`               | Search `1` returned the administrator user; `role=barista` and `blocked=true` filters returned empty sets; no `PATCH` request occurred before explicit assignment.                                                                                                                                                                                                                                                                                                                       |
| `FTS-004-004` | Empty users state                                                | `blocked`     | `QA-001-BLOCKER-002` | Empty-state component was observed for zero-result search/filter responses, but canonical precondition "no user records in the system" was unavailable because the stand contains a bootstrap administrator.                                                                                                                                                                                                                                                                             |
| `FTS-004-005` | Invalid assignable role error                                    | `pass`        | `none`               | Direct `PATCH /backoffice/users/12e53a00-206d-423b-a9b1-c8bd8d7df9f0/role` with `role=customer` returned `422 role-not-assignable`; follow-up `GET /backoffice/users` kept roles `[administrator]`, so no partial role change was observed.                                                                                                                                                                                                                                              |
| `FTS-004-006` | Non-administrator access guard                                   | `blocked`     | `QA-001-BLOCKER-005` | Published test-e2e stand exposed no authenticated non-administrator or barista actor. Explicit test-mode actors `123456789` and `999999999` returned `403 backoffice-user-not-found` for session, `GET /backoffice/users`, and direct `PATCH /backoffice/users/{userId}/role`; this proves unknown actors are rejected but does not satisfy the documented non-administrator precondition or expected `backoffice-capability-forbidden` / `administrator-role-required` guard semantics. |
| `FTS-004-007` | Assign `administrator` by BootstrapAdministrator                 | `pass`        | `none`               | Default test-mode actor resolved to bootstrap administrator `telegramId=1`; direct `PATCH` with `role=administrator` returned `200` with roles `[administrator]`, full backoffice capabilities, and no `administrator-role-assignment-forbidden` error.                                                                                                                                                                                                                                  |
| `FTS-004-008` | Forbid `administrator` assignment by non-bootstrap administrator | `blocked`     | `QA-001-BLOCKER-004` | Published test-e2e stand exposed no ordinary non-bootstrap administrator actor; explicit session for `testTelegramId=123456789` returned `403 backoffice-user-not-found`, which does not satisfy the ordinary administrator precondition.                                                                                                                                                                                                                                                |
| `FTS-004-009` | UI boundary excludes `unblock_user`                              | `pass`        | `none`               | Manual QA scope was kept to users list, search/filter, role assignment, and guards. Live `/users` UI exposed role-assignment entrypoints only (`Добавить пользователя`, row action `Назначить роль`) and did not expose `block_user` or `unblock_user` actions during this pass. System artifacts continue to list block/unblock as outside `FEATURE-004`.                                                                                                                               |

## Scenario details

### `FTS-004-001` — Users screen and role assignment entrypoint

- Preconditions: `administrator` actor with `users` capability; at least one user exists.
- Expected evidence:
  - `Пользователи` tab is visible only in administrator users boundary.
  - `GET /backoffice/users` returns an observable list.
  - `Добавить пользователя` opens the role assignment form.
- Actual result: `pass on published test-e2e stand. Opened https://expressa-e2e-test.vitykovskiy.ru/users as test-mode administrator. Navigation displayed the administrative tab Пользователи. Network evidence: POST /backoffice/auth/session -> 201; GET /backoffice/users -> 200 with one item and meta.total=1. UI displayed user "1" with role badge Администратор and status Активен. Clicking Добавить пользователя opened the assignment dialog with title Новый пользователь, user selector, disabled prefilled Имя and Telegram Username fields for the selected user, role selector defaulting to Бариста, disabled confirm button because selected user has empty telegramUsername, and Отмена.`
- Status: `pass`

### `FTS-004-002` — Assign `barista` role

- Preconditions: `administrator` actor; users screen is open; target user is identifiable.
- Test data: `name=Иван Петров`, `telegramUsername=@ivan_petrov`, `role=barista`.
- Expected evidence:
  - Required fields are accepted.
  - `PATCH /backoffice/users/{userId}/role` is sent with `role=barista`.
  - Response includes saved `roles` and recalculated `backofficeAccess.capabilities`.
  - Success notification is visible.
- Actual result: `blocked on published test-e2e stand. Baseline GET /backoffice/users returned only userId=12e53a00-206d-423b-a9b1-c8bd8d7df9f0 with displayName=1, empty telegramUsername, roles=[administrator], blocked=false, and availableRoleAssignments=[barista, administrator]. The UI dialog observed in Subtask 1/2 prefilled the selected user and kept confirmation disabled because the target had empty telegramUsername. A direct PATCH role=barista against the only available target would assign an additional role to the bootstrap administrator and would not prove the required barista-only recalculated access to Заказы and Доступность. No separate target matching the scenario data name=Иван Петров, telegramUsername=@ivan_petrov, role=barista was available without mutating shared runtime data outside this subtask.`
- Status: `blocked`

### `FTS-004-003` — Search and filter before selecting user

- Preconditions: `administrator` actor; multiple users with distinguishable names, usernames, roles, or statuses.
- Expected evidence:
  - Search narrows the displayed users by name or Telegram username.
  - Filter tabs narrow the displayed users by selected filter.
  - Role assignment entrypoint remains available from filtered results.
  - Roles do not change before a confirmed assignment operation.
- Actual result: `pass on published test-e2e stand. Opened search via Поиск and entered query "1"; network evidence: GET /backoffice/users?search=1 -> 200 with the same administrator user, and role assignment entrypoint remained available from the filtered result. Switching to Баристы produced GET /backoffice/users?search=1&role=barista -> 200 with items=[] and meta.total=0. Switching to Заблокированные produced GET /backoffice/users?search=1&blocked=true -> 200 with items=[] and meta.total=0. Empty results displayed heading Пользователей нет and subtitle Они появятся после активации бота; assignment entrypoint was disabled while no identifiable user was present. Network log for this pass contained no PATCH /backoffice/users/{userId}/role requests, so search/filter did not change roles.`
- Status: `pass`

### `FTS-004-004` — Empty users state

- Preconditions: users boundary returns an empty list.
- Expected evidence:
  - Empty state text says users will appear after bot activation.
  - No hidden partial user list is shown.
  - Assignment remains unavailable until an identifiable target user exists.
- Actual result: `blocked for canonical no-users precondition. The published test-e2e stand currently contains the bootstrap administrator returned by GET /backoffice/users, so a system state with no user records was not available without changing runtime data outside this subtask. Partial empty-state evidence was collected through zero-result search/filter responses: role=barista and blocked=true returned items=[] and meta.total=0, the UI displayed Пользователей нет / Они появятся после активации бота, no hidden partial list was shown, and Добавить пользователя was disabled while no result user was identifiable.`
- Status: `blocked`

### `FTS-004-005` — Invalid assignable role error

- Preconditions: `administrator` actor; assignment operation can be attempted with an invalid role through UI manipulation or direct request.
- Test data: `role=customer` or another value outside `barista`, `administrator`.
- Expected evidence:
  - Backend rejects with `422 Unprocessable Entity`.
  - Business error is `role-not-assignable`.
  - Current UI/form state is preserved without false success notification.
  - Target user roles remain unchanged.
- Actual result: `pass on published test-e2e stand through direct contract check. Request: PATCH /backoffice/users/12e53a00-206d-423b-a9b1-c8bd8d7df9f0/role with body {"role":"customer"} under default test-mode bootstrap administrator actor. Response: 422 Unprocessable Entity with errorDetails {"message":"role-not-assignable","error":"Unprocessable Entity","statusCode":422}. Follow-up GET /backoffice/users returned the same target with roles=[administrator], blocked=false, and availableRoleAssignments=[barista, administrator], confirming no partial role change. UI false success was not observed because this negative value is not selectable through the canonical role selector and was validated at contract boundary.`
- Status: `pass`

### `FTS-004-006` — Non-administrator access guard

- Preconditions: actor without `administrator` role or without `users` capability.
- Expected evidence:
  - `Пользователи` tab and role assignment actions are hidden.
  - Direct route or direct assignment request is rejected.
  - Rejection uses `403 Forbidden` with `backoffice-capability-forbidden` or `administrator-role-required`, depending on rejection point.
  - Target user roles remain unchanged.
- Actual result: `blocked on published test-e2e stand. The required precondition is an authenticated actor without administrator role or without users capability. The stand exposed the bootstrap administrator actor only: POST /backoffice/auth/session with testTelegramId=1 returned 201 and capabilities=[orders, availability, menu, users, settings]. Attempts to use explicit test-mode actors 123456789 and 999999999 returned 403 backoffice-user-not-found for POST /backoffice/auth/session, GET /backoffice/users with x-test-telegram-id, and PATCH /backoffice/users/12e53a00-206d-423b-a9b1-c8bd8d7df9f0/role with role=barista. This confirms direct unknown actors are rejected and target roles were not changed, but it does not validate the required non-administrator guard because no authenticated non-admin/barista actor was available. UI direct-route visibility for a non-admin actor could not be observed for the same reason.`
- Status: `blocked`

### `FTS-004-007` — Assign `administrator` by BootstrapAdministrator

- Preconditions: actor matches `ADMIN_TELEGRAM_ID`; actor has `users` capability; target user can receive `administrator`.
- Test data: `role=administrator`.
- Expected evidence:
  - Role `administrator` is accepted only for BootstrapAdministrator.
  - `PATCH /backoffice/users/{userId}/role` returns success.
  - Response includes saved `roles` and recalculated `backofficeAccess.capabilities`.
  - No `administrator-role-assignment-forbidden` error is present.
- Actual result: `pass on published test-e2e stand through direct contract check. Default test-mode actor without explicit testTelegramId resolved through POST /backoffice/auth/session to userId=12e53a00-206d-423b-a9b1-c8bd8d7df9f0, telegramId=1, roles=[administrator], capabilities=[orders, availability, menu, users, settings]. Request: PATCH /backoffice/users/12e53a00-206d-423b-a9b1-c8bd8d7df9f0/role with body {"role":"administrator"}. Response: 200 OK with userId=12e53a00-206d-423b-a9b1-c8bd8d7df9f0, roles=[administrator], backofficeAccess.capabilities=[orders, availability, menu, users, settings]. No administrator-role-assignment-forbidden error was present. This validates the BootstrapAdministrator success guard on the only available target; it does not create a separate administrator target user because the stand exposed only the bootstrap administrator.`
- Status: `pass`

### `FTS-004-008` — Forbid `administrator` assignment by non-bootstrap administrator

- Preconditions: ordinary `administrator` actor does not match `ADMIN_TELEGRAM_ID`.
- Test data: `role=administrator`.
- Expected evidence:
  - Backend rejects with `403 Forbidden`.
  - Business error is `administrator-role-assignment-forbidden`.
  - UI does not show false success state.
  - Target user roles remain unchanged.
- Actual result: `blocked on published test-e2e stand. The required precondition is an ordinary administrator actor that does not match ADMIN_TELEGRAM_ID. The stand exposed only the bootstrap administrator actor. An explicit POST /backoffice/auth/session with testTelegramId=123456789 returned 403 backoffice-user-not-found, so it did not provide an ordinary administrator session and could not exercise the administrator-role-assignment-forbidden guard. Target roles remained unchanged in the observed baseline and follow-up checks.`
- Status: `blocked`

### `FTS-004-009` — UI boundary excludes `unblock_user`

- Preconditions: system artifacts and `.references/Expressa_admin` users screen are available.
- Expected evidence:
  - Manual QA coverage includes only users list, role assignment, search/filter, empty state, and guards from `FEATURE-004`.
  - `block_user` and `unblock_user` are treated as neighboring actions outside `FEATURE-004`.
  - Any live UI deviation that merges role assignment acceptance with block/unblock behavior is recorded as a defect or blocker.
- Actual result: `pass. The manual QA route remained limited to viewing users, search/filter, assigning roles, and related guards. The live users screen showed users list controls, filters Все/Баристы/Заблокированные, button Добавить пользователя, and row action Действия пользователя -> Назначить роль. No block_user or unblock_user action was exposed in the observed live UI. The feature spec, contract, and frontend application map explicitly keep block_user and unblock_user outside FEATURE-004; QA evidence does not expand acceptance coverage into those neighboring actions.`
- Status: `pass`

## UI parity checklist

- Users screen reference: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Add user dialog reference: `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- UI contract source: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`

| Check                                                                                                                         | Expected source     | Status                               | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen composition, top bar, users title, search action                                                                       | `UsersScreen.tsx`   | `pass`                               | Desktop live UI showed shell navigation, title `Пользователи`, two search icon entrypoints consistent with mobile top bar / desktop header reference pattern, and `/backoffice/users -> 200`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `Добавить пользователя` entrypoint placement and behavior                                                                     | `UsersScreen.tsx`   | `pass`                               | Live UI placed the primary entrypoint above filters and opened the role assignment dialog. Button was enabled because one identifiable user existed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Filter tabs `Все`, `Баристы`, `Заблокированные`                                                                               | `UsersScreen.tsx`   | `pass`                               | Live UI showed all three canonical filter tabs. Previous subtask evidence confirmed filter requests and empty zero-result states.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Empty state icon/title/subtitle                                                                                               | `UsersScreen.tsx`   | `pass-with-limited-precondition`     | Canonical no-users precondition remained unavailable, but zero-result search/filter states displayed `Пользователей нет` / `Они появятся после активации бота`, matching reference text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| User row layout, role/status badges, action affordance                                                                        | `UsersScreen.tsx`   | `pass-with-system-allowed-extension` | Live row showed avatar/identity, role badge `Администратор`, status badge `Активен`, and row action menu. Status is present in contract as `blocked` and the plan checklist expects role/status badges, so this is not treated as a defect.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Dialog title, description, required fields, role select, confirm/ghost buttons                                                | `AddUserDialog.tsx` | `deviation-recorded`                 | Live dialog title matched `Новый пользователь`, but description was `Выберите пользователя и назначьте роль` instead of reference `Добавьте нового пользователя в систему`; live dialog added user selector `Пользователь`, rendered name and Telegram fields disabled from selected user data, and showed inline validation `Укажите Telegram Username.`. Reference dialog uses editable `Имя` and `Telegram Username` inputs. This is a UI parity deviation against `.references/Expressa_admin`, partially explained by the implementation map's existing-user role assignment model. No BUG file was created in this subtask because the current work scope is limited to QA evidence/plan artifacts. |
| Responsive behavior and visual states match `.references/Expressa_admin` unless system artifacts explicitly restrict behavior | UI contract         | `blocked-partial`                    | Desktop visual-state parity was checked through live UI text and controls. Full responsive parity was not completed because this subtask had no usable browser DevTools session and the mandatory scenario set already remains blocked by missing runtime actors/test data.                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Scope boundary confirmation

- `FEATURE-004` included scope: viewing users, search/filter for role assignment target selection, assigning roles `barista` and `administrator`, and related access guards.
- `FEATURE-004` excluded scope: `block_user`, `unblock_user`, changing `customer`, revoking an assigned role, and creating a new visual solution outside `.references/Expressa_admin`.
- Manual QA status: `pass`
- Evidence notes: `Confirmed through feature spec, contract, UI behavior mapping, frontend map, reference files, and live UI. `block_user`and`unblock_user` are neighboring users-screen actions outside FEATURE-004; manual QA evidence covers only viewing users, search/filter, role assignment, and guards.`

## Defect handoff

### Created defects

| BUG ID    | Contour    | Related scenario            | Status    | Summary                                                                                                                                                                                                                                         |
| --------- | ---------- | --------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BUG-003` | `frontend` | `UI parity / AddUserDialog` | `created` | Live role assignment dialog differs from `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`; frontend owner must align UI parity or update canonical artifacts if the existing-user assignment model is intentionally different. |

### No-defect confirmation

- Final no-defect confirmation: `not-applicable`
- Reason: Manual QA is blocked by missing mandatory runtime preconditions and contains a recorded UI parity deviation for the dialog. No broad no-defect confirmation is valid.

### Blockers

| Blocker ID           | Related scenario | Status      | Details                                                                                                                                                      |
| -------------------- | ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `QA-001-GAP-001`     | `all`            | `delegated` | Referenced context package `FEATURE-004-context-05-qa-manual-user-role-management.md` is absent. Corrective task: `SA-003`.                                  |
| `QA-001-BLOCKER-002` | `FTS-004-004`    | `delegated` | Canonical empty users precondition requires an environment with no user records. Corrective task: `DO-011`.                                                  |
| `QA-001-BLOCKER-003` | `FTS-004-002`    | `delegated` | Published `test-e2e` stand exposed only the bootstrap administrator target with empty telegramUsername and roles=[administrator]. Corrective task: `DO-011`. |
| `QA-001-BLOCKER-004` | `FTS-004-008`    | `delegated` | Published `test-e2e` stand exposed no ordinary non-bootstrap administrator actor. Corrective task: `DO-011`.                                                 |
| `QA-001-BLOCKER-005` | `FTS-004-006`    | `delegated` | Published `test-e2e` stand exposed no authenticated non-administrator or barista actor. Corrective task: `DO-011`.                                           |

### Corrective tasks

| Task ID   | Owner role           | Purpose                                                                                                |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| `BUG-003` | `Фронтенд`           | Fix or canonically resolve the role assignment dialog UI parity deviation.                             |
| `DO-011`  | `Девопс`             | Provide reproducible test-e2e runtime preconditions/test data for blocked mandatory scenarios.         |
| `SA-003`  | `Системный аналитик` | Restore the missing manual QA context package or update QA-001 read set to existing canonical sources. |
| `QA-008`  | `Тестирование`       | Repeat manual QA after corrective tasks and update final acceptance decision.                          |

## Final QA decision

- Decision: `blocked`
- Allowed values for finalization: `accepted`, `accepted-with-defects`, `blocked`
- Decision rationale: `Manual QA cannot accept FEATURE-004 because mandatory scenarios remain blocked by missing runtime preconditions/test data: FTS-004-002, FTS-004-004, FTS-004-006, and FTS-004-008. FTS-004-009 scope boundary passed, and no block_user/unblock_user behavior was included in acceptance scope. Dialog UI parity deviation is recorded for handoff, but the primary final decision is blocked due mandatory scenario blockers.`
