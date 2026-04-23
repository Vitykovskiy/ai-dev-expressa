# BE-002-01 Context Package

## Task card

- Source task: `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- Parent feature: `FEATURE-002`
- Subtask: `BE-002-01 Domain Contract Hardening`
- Role: `Backend`
- Related plan: `BE-002-execution-plan.md`

## Goal

Verify and harden menu-catalog domain validation and mutation behavior against the FEATURE-002 contract.

## Mandatory read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/architecture/stack.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/backend-access.md`

## Key facts

- `MenuCatalogValidator` already rejects incomplete drink size models with `invalid-drink-size-model`.
- `MenuCatalogValidator` already rejects `drinkSizePrices` on regular items with `invalid-drink-size-model`.
- `MenuCatalogValidator` already rejects unknown option-group selection modes with `invalid-option-group-rule`.
- `MenuCatalogService.save()` already validates category references, item shapes, and option-group shapes before repository persistence.
- Targeted backend tests and backend typecheck pass in the current repository state.

## Allowed edit area

- `backend/src/menu-catalog/domain/**`
- `backend/src/menu-catalog/menu-catalog.commands.ts`
- `backend/test/menu-catalog-domain.spec.ts`
- `backend/test/menu-catalog-mutations.spec.ts`

## Forbidden area

- `backend/src/menu-catalog/menu-catalog.controller.ts`
- `backend/src/menu-catalog/menu-catalog.service.ts`
- `backend/src/menu-catalog/repository/**`
- `backend/src/identity-access/**`
- `docs/**`

## Dependencies

- `BE-002-02` depends on completion or explicit no-op evidence for this subtask.

## Checks

- `npm test --prefix backend -- menu-catalog-domain menu-catalog-mutations`
- `npm run typecheck --prefix backend`

## Result

- No code changes were required for this subtask in the current repository state.
