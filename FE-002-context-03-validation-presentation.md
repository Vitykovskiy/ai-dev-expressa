# FE-002 Context 03 Validation, Presentation And Error Mapping

## Context Card

- Source task: `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- Subtask: `FE-002-03 Validation, Presentation And Error Mapping`
- Executor role: `Фронтенд`
- Responsibility area: validation helpers, presentation helpers, user-visible FE-002 errors and focused tests.
- Related plan: `FE-002-execution-plan.md`

## Goal

Reviewer must see that menu catalog forms enforce local input constraints, preserve backend validation as source of truth, and show user-visible messages for the documented FE-002 errors.

## Behavioral Prompt

```text
You operate as a strict frontend engineer.

Complete only the FE-002-03 Validation, Presentation And Error Mapping subtask within FE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Mandatory Read Set

- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `FE-002-execution-plan.md`
- `FE-002-context-01-api-store.md`
- `FE-002-context-02-menu-ui.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/domain-model/menu-catalog.md`
- `frontend/src/modules/menu-catalog/validation.ts`
- `frontend/src/modules/menu-catalog/presentation.ts`
- `frontend/src/modules/menu-catalog/validation.spec.ts`
- `frontend/src/modules/menu-catalog/presentation.spec.ts`
- `frontend/src/views/MenuCatalogView.vue`
- `frontend/src/components/menu-catalog/*.vue`

## Key Facts

- Category and item names must be non-empty after trimming.
- Regular items use `basePrice` and do not use drink size prices.
- Drinks require all sizes `S`, `M`, `L` with valid positive prices.
- A free option has price `0`; negative option price is invalid.
- Backend errors `invalid-drink-size-model`, `invalid-option-group-rule`, access errors and request failures must map to user-visible outcomes.
- Client validation is an ergonomic pre-check and does not replace backend validation.

## Allowed Edit Area

- `frontend/src/modules/menu-catalog/validation.ts`
- `frontend/src/modules/menu-catalog/presentation.ts`
- `frontend/src/modules/menu-catalog/validation.spec.ts`
- `frontend/src/modules/menu-catalog/presentation.spec.ts`
- Minimal changes in `frontend/src/views/MenuCatalogView.vue` or `frontend/src/components/menu-catalog/*.vue` only to surface validation messages produced here.

## Forbidden Edit Area

- `.references/Expressa_admin/**`
- `backend/**`
- `docs/system/**`
- API endpoint paths or router guard semantics.

## Inputs And Dependencies

- Depends on FE-002-01 and FE-002-02.
- FE-002-04 depends on stable validation and presentation behavior for tests and evidence.

## Expected Result

Validation and presentation helpers cover FE-002 input constraints, labels, prices, option-group category derivation and documented error mapping with focused tests.

## Checks

- `npm test -- --run src/modules/menu-catalog/validation.spec.ts src/modules/menu-catalog/presentation.spec.ts`
- If the targeted command is incompatible with the local test runner, run the closest frontend test command for these specs and record it.

## Readiness Criteria

- Incomplete drink sizes produce the documented local message before save when possible.
- Backend `invalid-drink-size-model` remains mapped distinctly.
- Backend `invalid-option-group-rule` remains mapped distinctly.
- Free option price `0` remains valid.
- Presentation helpers do not hide option groups as an implementation shortcut.

## Risks And Prohibitions

- Risk: accepting a partial drink size model because the React reference had a documented gap.
- Prohibition: do not weaken backend validation semantics in client tests.

## Open Questions

- None.
