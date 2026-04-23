# BE-002 Execution Plan

## Source Task

- Task card: `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- Parent feature: `FEATURE-002`
- Role: `Бэкенд`
- Current baseline: task card is archived with status `Выполнена`; execution still follows the user request to run sequential subtasks against the current repository state.

## Goal

Backend must provide a protected administrator-only menu catalog API for categories, items, drink size prices, option groups, options, and option-group assignments, with reproducible tests for `invalid-drink-size-model`, `invalid-option-group-rule`, and capability denial.

## Global Read Set

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

## Subtasks

### BE-002-01 Domain Contract Hardening

- Status: `completed`
- Context: `BE-002-context-01-domain-contract-hardening.md`
- Objective: verify and harden menu-catalog domain validation and mutation behavior against the FEATURE-002 contract.
- Allowed edit area: `backend/src/menu-catalog/domain/**`, `backend/src/menu-catalog/menu-catalog.commands.ts`, `backend/test/menu-catalog-domain.spec.ts`, `backend/test/menu-catalog-mutations.spec.ts`.
- Required checks: `npm test --prefix backend -- menu-catalog-domain menu-catalog-mutations`, then `npm run typecheck --prefix backend`.

### BE-002-02 API Guard And Error Mapping

- Status: `completed`
- Context: `BE-002-context-02-api-guard-and-error-mapping.md`
- Objective: verify and harden `/backoffice/menu/*` endpoint behavior, capability guard attachment, and transport error mapping.
- Allowed edit area: `backend/src/menu-catalog/**`, `backend/src/identity-access/auth/backoffice-auth.guard.ts`, `backend/test/menu-catalog.integration.spec.ts`, `backend/test/backoffice-role-guard.spec.ts`.
- Required checks: `npm test --prefix backend -- menu-catalog.integration backoffice-role-guard`, then `npm run typecheck --prefix backend`.
- Dependency: BE-002-01 completed or explicitly marked as no-op with evidence.

### BE-002-03 Backend Quality Gate And Documentation Reconciliation

- Status: `completed`
- Context: `BE-002-context-03-quality-and-documentation.md`
- Objective: run the backend quality gate, reconcile backend menu-catalog application map/task evidence if the implementation changed, and leave BE-002 ready for review.
- Allowed edit area: `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `tasks/archive/BE-002-administrator-menu-catalog-backend.md`, backend files only if required by failed checks from this subtask.
- Required checks: `npm run lint --prefix backend`, `npm run format:check --prefix backend`, `npm run typecheck --prefix backend`, `npm test --prefix backend`, `npm run build --prefix backend`.
- Dependency: BE-002-02 completed or explicitly marked as no-op with evidence.
- Completion evidence: all required backend checks passed; no backend code or documentation changes were needed during reconciliation.

## Completion Rules

- A subtask is complete only after its context file boundaries are followed, required checks are run or an explicit blocker is recorded, and this plan has its status changed from `pending` to `completed`.
- Commits must use Conventional Commits.
- Do not modify `.references/**`, `FEATURE-002-context-*.md`, or `FEATURE-002-execution-plan.md` as part of BE-002 subtasks.
