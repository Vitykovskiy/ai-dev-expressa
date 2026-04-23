# FE-002 Context 01 API Boundary And Store

## Context Card

- Source task: `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- Subtask: `FE-002-01 API Boundary And Store`
- Executor role: `Фронтенд`
- Responsibility area: client contract types, menu catalog API adapter, store state and store tests.
- Related plan: `FE-002-execution-plan.md`

## Goal

Reviewer must see that the frontend menu catalog module talks to `/backoffice/menu/*` through a single API boundary, keeps snapshot state in the store, maps transport errors to known codes, and does not compute role or capability locally.

## Behavioral Prompt

```text
You operate as a strict frontend engineer.

Complete only the FE-002-01 API Boundary And Store subtask within FE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Mandatory Read Set

- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `FE-002-execution-plan.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `frontend/src/modules/menu-catalog/types.ts`
- `frontend/src/modules/menu-catalog/api.ts`
- `frontend/src/modules/menu-catalog/store.ts`
- `frontend/src/modules/menu-catalog/api.spec.ts`
- `frontend/src/modules/menu-catalog/store.spec.ts`

## Key Facts

- `Manage menu catalog` uses `GET /backoffice/menu/catalog`, category endpoints, item endpoints and option-group endpoints under `/backoffice/menu/*`.
- `MenuCatalogSnapshot` shape is `{ categories, items, optionGroups }`.
- Backoffice menu endpoints require capability `menu`; frontend uses Telegram/test-mode headers from the auth contract and does not send roles.
- `invalid-drink-size-model`, `invalid-option-group-rule`, `administrator-role-required` and backoffice capability errors must remain user-visible through the frontend error pipeline.
- Barista availability changes are outside FE-002.

## Allowed Edit Area

- `frontend/src/modules/menu-catalog/types.ts`
- `frontend/src/modules/menu-catalog/api.ts`
- `frontend/src/modules/menu-catalog/store.ts`
- `frontend/src/modules/menu-catalog/api.spec.ts`
- `frontend/src/modules/menu-catalog/store.spec.ts`

## Forbidden Edit Area

- `.references/Expressa_admin/**`
- `backend/**`
- `frontend/src/views/**`
- `frontend/src/components/**`
- `docs/system/**`
- Any route, auth or navigation behavior outside the menu-catalog module.

## Inputs And Dependencies

- This is the first implementation subtask.
- FE-002-02 and FE-002-03 depend on stable types, API client methods and store operations from this subtask.

## Expected Result

The menu catalog module exposes complete typed operations for categories, items and option groups, refreshes or applies snapshots consistently after mutations, and has tests covering request paths, auth headers, error mapping and store state transitions.

## Checks

- `npm test -- --run src/modules/menu-catalog/api.spec.ts src/modules/menu-catalog/store.spec.ts`
- If the targeted command is incompatible with the local test runner, run the closest frontend test command for these specs and record it.

## Readiness Criteria

- API methods cover all FE-002 menu catalog operations.
- Store exposes load, create, update and delete operations needed by `/menu`.
- Tests prove at least one success and one failure path for API and store.
- No role or capability is hardcoded in the menu-catalog module.

## Risks And Prohibitions

- Risk: treating React reference types as contract types instead of `docs/system/contracts/menu-and-availability-management.md`.
- Prohibition: do not read backend implementation to infer API semantics.

## Open Questions

- None.
