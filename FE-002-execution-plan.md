# FE-002 Execution Plan

## Source Task

- Task card: `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- Delivery unit: `FEATURE-002`
- Role: `Фронтенд`
- Status at intake: archived as `Выполнена`

## Execution Rule

Subtasks are executed sequentially. Each subtask uses exactly one context package from the repository root. After a subtask is completed and committed, the next subtask becomes eligible.

## Subtasks

### FE-002-01 API Boundary And Store

- Context package: `FE-002-context-01-api-store.md`
- Status: `Выполнена`
- Goal: verify and complete the client API boundary and store for `Manage menu catalog`.
- Allowed area: `frontend/src/modules/menu-catalog/api.ts`, `frontend/src/modules/menu-catalog/store.ts`, `frontend/src/modules/menu-catalog/types.ts`, related tests.
- Required checks: `npm test -- --run src/modules/menu-catalog/api.spec.ts src/modules/menu-catalog/store.spec.ts`, or record why unavailable.

### FE-002-02 Menu UI Components And View Orchestration

- Context package: `FE-002-context-02-menu-ui.md`
- Status: `Выполнена`
- Goal: verify and complete `/menu` view orchestration and feature-specific menu catalog components.
- Allowed area: `frontend/src/views/MenuCatalogView.vue`, `frontend/src/components/menu-catalog/*.vue`, `frontend/src/ui/*` only if an existing primitive blocks the task.
- Required checks: `npm run typecheck`, targeted component/unit tests if changed, or record why unavailable.

### FE-002-03 Validation, Presentation And Error Mapping

- Context package: `FE-002-context-03-validation-presentation.md`
- Status: `Выполнена`
- Goal: verify and complete field validation, contract error mapping and presentation helpers for categories, items, drink prices and option groups.
- Allowed area: `frontend/src/modules/menu-catalog/validation.ts`, `frontend/src/modules/menu-catalog/presentation.ts`, related tests, minimal component adjustments when needed to expose validation state.
- Required checks: `npm test -- --run src/modules/menu-catalog/validation.spec.ts src/modules/menu-catalog/presentation.spec.ts`, or record why unavailable.

### FE-002-04 Tests, Guard Evidence And Documentation Consistency

- Context package: `FE-002-context-04-tests-evidence.md`
- Status: `Выполнена`
- Goal: verify frontend tests, route/capability guard behavior, e2e scenario mapping and application-map consistency for FE-002.
- Allowed area: frontend menu-catalog tests, router/navigation tests, `e2e/menu-catalog/admin-menu-catalog.spec.ts`, `docs/architecture/application-map/frontend-backoffice.md` only if actual frontend structure changed.
- Required checks: `npm run lint`, `npm run stylelint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`, or record unavailable checks.

## Completion Criteria

- Each subtask has a commit.
- Each completed subtask status is marked as `Выполнена` in this plan.
- FE-002 remains within the existing `/menu` route and administrator `menu` capability.
- No subtask changes `.references/Expressa_admin`.
- No subtask implements barista availability, customer order flow, order processing, slots, users or settings.
