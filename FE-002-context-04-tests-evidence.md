# FE-002 Context 04 Tests, Guard Evidence And Documentation Consistency

## Context Card

- Source task: `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- Subtask: `FE-002-04 Tests, Guard Evidence And Documentation Consistency`
- Executor role: `Фронтенд`
- Responsibility area: frontend test coverage, route/capability guard evidence, e2e mapping and frontend application-map consistency.
- Related plan: `FE-002-execution-plan.md`

## Goal

Reviewer must see that FE-002 behavior is covered by frontend tests and e2e scenario mapping, that `/menu` stays capability-protected, and that architecture documentation matches any actual frontend structure changes.

## Behavioral Prompt

```text
You operate as a strict frontend engineer.

Complete only the FE-002-04 Tests, Guard Evidence And Documentation Consistency subtask within FE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Mandatory Read Set

- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `FE-002-execution-plan.md`
- `FE-002-context-01-api-store.md`
- `FE-002-context-02-menu-ui.md`
- `FE-002-context-03-validation-presentation.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `frontend/src/router/index.ts`
- `frontend/src/router/guards.ts`
- `frontend/src/router/guards.spec.ts`
- `frontend/src/modules/navigation/tabs.ts`
- `frontend/src/modules/navigation/tabs.spec.ts`
- `frontend/src/modules/menu-catalog/*.spec.ts`
- `e2e/menu-catalog/admin-menu-catalog.spec.ts`

## Key Facts

- Scenario IDs `FTS-002-001` through `FTS-002-011` define FE-002 test expectations.
- `/menu` must remain administrator/capability `menu` protected.
- Hiding a tab does not replace direct-route guard behavior.
- Browser e2e scenario mapping already points to `e2e/menu-catalog/admin-menu-catalog.spec.ts`.
- Application map updates are required only when frontend structure, entrypoints, shared dependencies, run path or test path changed.

## Allowed Edit Area

- `frontend/src/modules/menu-catalog/*.spec.ts`
- `frontend/src/router/guards.spec.ts`
- `frontend/src/modules/navigation/tabs.spec.ts`
- `e2e/menu-catalog/admin-menu-catalog.spec.ts`
- `docs/architecture/application-map/frontend-backoffice.md` only if actual frontend structure changed.
- `FE-002-execution-plan.md` status updates for this subtask.

## Forbidden Edit Area

- `.references/Expressa_admin/**`
- `backend/**`
- `docs/system/**`
- Production frontend code unless a test exposes a small FE-002 defect and the fix stays within previously completed subtask boundaries.

## Inputs And Dependencies

- Depends on FE-002-01, FE-002-02 and FE-002-03 completion.
- This is the final subtask.

## Expected Result

FE-002 has targeted test coverage and documented check results. Any application map update reflects real code structure only.

## Checks

- `npm run lint`
- `npm run stylelint`
- `npm run format:check`
- `npm run typecheck`
- `npm test`
- `npm run build`
- If any check is unavailable, record the exact command and reason.

## Readiness Criteria

- Tests cover menu API/store/validation/presentation behavior or explicitly document remaining gaps.
- Route/navigation tests keep `/menu` bound to capability `menu`.
- E2E scenario mapping includes the required FE-002 scenario IDs.
- Plan status is updated for completed subtasks.

## Risks And Prohibitions

- Risk: treating tab visibility as sufficient access control.
- Prohibition: do not change documented system scenarios in this implementation subtask.

## Open Questions

- None.
