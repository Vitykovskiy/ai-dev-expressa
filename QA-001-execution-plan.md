# QA-001 Execution Plan

## Task

- Source task-card: `tasks/QA-001-feature-004-manual-user-role-management.md`
- Feature: `FEATURE-004`
- Lane: manual QA
- Required result: manual acceptance evidence for `FTS-004-001`..`FTS-004-009`, UI parity check, scope boundary confirmation, and defect handoff decision.

## Read Set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/QA-001-feature-004-manual-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`

## Input Gap

- [ ] `FEATURE-004-context-05-qa-manual-user-role-management.md` is referenced by the task-card but is absent from the repository root and was not found by `rg --files -g "*FEATURE-004-context-05*" -g "*context-05*"`.

## Subtasks

### Subtask 1: Prepare QA Evidence Scaffold

- Status: completed
- Owner: next subagent
- Scope: create or update root QA evidence artifact for this manual lane.
- Inputs: task-card, feature spec, test scenarios, QA standards, and the input gap above.
- Expected output:
  - Root evidence file for `QA-001` exists.
  - Evidence file contains sections for `FTS-004-001`..`FTS-004-009`.
  - Missing context package is recorded as a gap without reading archived tasks.
  - Evidence file has a defect handoff section for `BUG-*` or explicit no-defect confirmation.

### Subtask 2: Execute Users Screen, Search, Filter, Empty-State Manual Checks

- Status: completed
- Owner: next subagent
- Scope: cover `FTS-004-001`, `FTS-004-003`, and `FTS-004-004`.
- Inputs: QA evidence artifact from Subtask 1, users screen reference, feature test scenarios, frontend/backend/runtime maps.
- Expected output:
  - Evidence records pass/fail/blocker for users screen visibility, list loading, `Добавить пользователя` entrypoint, search/filter behavior, and empty-state handling.
  - Observed deviations are recorded with expected/actual and proposed defect contour.

### Subtask 3: Execute Role Assignment Success And Negative Manual Checks

- Status: completed
- Owner: next subagent
- Scope: cover `FTS-004-002`, `FTS-004-005`, `FTS-004-007`, and `FTS-004-008`.
- Inputs: QA evidence artifact, role assignment contract, feature test scenarios, backend access map.
- Expected output:
  - Evidence records pass/fail/blocker for `barista` assignment, invalid role rejection, `administrator` assignment by `BootstrapAdministrator`, and `administrator` assignment guard for non-bootstrap administrator.
  - Evidence confirms response/error semantics or records defect handoff details.

### Subtask 4: Execute Access Guard, UI Parity, Scope Boundary, And Final QA Decision

- Status: completed
- Owner: next subagent
- Scope: cover `FTS-004-006` and `FTS-004-009`, then finalize manual QA evidence.
- Inputs: QA evidence artifact, UI contract, UI behavior mapping, users screen/dialog references, feature boundaries.
- Expected output:
  - Evidence records pass/fail/blocker for non-administrator guard through UI and direct access.
  - Evidence confirms UI parity against `.references/Expressa_admin` for users screen and dialog or records deviations.
  - Evidence explicitly confirms `block_user` and `unblock_user` are outside `FEATURE-004` scope.
  - Final QA decision is recorded as accepted, accepted with defects, or blocked.

## Iteration Protocol

1. Invoke exactly one subagent at a time.
2. Give the subagent this task text: `Возьми следующую подзадачу из QA-001-execution-plan.md в работу`.
3. Wait for the subagent to finish.
4. Send the same subagent this task text: `Отметь подзадачу выполненной`.
5. Wait for the mark-done update.
6. Repeat until every subtask status is `completed`.
