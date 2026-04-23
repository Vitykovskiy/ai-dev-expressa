# BE-002 Context 03: Backend Quality Gate And Documentation Reconciliation

## Карточка контекста

- Исходная задача: `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- Подзадача: `BE-002-03 — Backend Quality Gate And Documentation Reconciliation`
- Роль исполнителя: `Бэкенд`
- Зона ответственности: backend quality gate, backend application-map evidence, BE-002 task completion evidence.
- Связанный план: `BE-002-execution-plan.md`

## Цель подзадачи

BE-002 must finish with reproducible backend quality evidence and documentation that matches the actual menu-catalog implementation after prior subtasks.

## Поведенческий промпт исполнителя

```text
You operate as a strict backend engineer.

Complete only BE-002-03 within BE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `BE-002-execution-plan.md`
- `BE-002-context-01-domain-contract-hardening.md`
- `BE-002-context-02-api-guard-and-error-mapping.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/backend-access.md`
- `backend/package.json`
- `backend/src/menu-catalog/**`
- `backend/test/menu-catalog*.spec.ts`

## Ключевые факты из источников

- Backend quality gates are `lint`, `format:check`, `typecheck`, `test`, and `build`.
- Backend menu catalog application map must change if module boundaries, endpoints, DTO, guard attachment, or error mapping changed.
- BE-002 task card already contains execution results; update only if current subtasks changed evidence or exposed a gap.
- Existing unrelated working-tree changes under `.references/**` and deleted `FEATURE-002-*` root files are outside this BE-002 subtask.

## Разрешенная зона правок

- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/backend-access.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `backend/**` only if needed to fix failures discovered by this subtask's required checks.
- `BE-002-execution-plan.md`

## Запрещенная зона правок

- `.references/**`
- `frontend/**`
- `e2e/**`
- `FEATURE-002-context-*.md`
- `FEATURE-002-execution-plan.md`
- Broad documentation rewrites unrelated to BE-002 backend evidence.

## Входы и зависимости

- BE-002-01 and BE-002-02 must be completed or explicitly no-op with evidence.

## Ожидаемый результат

Backend quality gate is run, any BE-002-specific failures are fixed or recorded as blockers, and BE-002 plan/doc evidence reflects the final state.

## Проверки

- `npm run lint --prefix backend`
- `npm run format:check --prefix backend`
- `npm run typecheck --prefix backend`
- `npm test --prefix backend`
- `npm run build --prefix backend`

## Критерии готовности

- Required backend checks pass or an explicit blocker is recorded in BE-002 evidence.
- Documentation/task evidence matches any actual backend changes.
- `BE-002-execution-plan.md` marks BE-002-03 as `completed`.

## Риски и запреты

- Do not normalize or restore unrelated root `FEATURE-002-*` files.
- Do not touch `.references/**`.
- Do not use documentation updates to hide a backend contract mismatch.

## Открытые вопросы

- Нет.
