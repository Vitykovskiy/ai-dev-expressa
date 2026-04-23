# BE-002 Context 02: API Guard And Error Mapping

## Карточка контекста

- Исходная задача: `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- Подзадача: `BE-002-02 — API Guard And Error Mapping`
- Роль исполнителя: `Бэкенд`
- Зона ответственности: HTTP boundary, capability guard attachment, integration behavior for menu catalog endpoints.
- Связанный план: `BE-002-execution-plan.md`

## Цель подзадачи

`/backoffice/menu/*` endpoints must be protected by capability `menu`, preserve the documented DTO boundary, and return canonical catalog/auth errors in integration tests.

## Поведенческий промпт исполнителя

```text
You operate as a strict backend engineer.

Complete only BE-002-02 within BE-002.

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
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/backend-access.md`
- `backend/src/menu-catalog/menu-catalog.controller.ts`
- `backend/src/menu-catalog/menu-catalog.service.ts`
- `backend/src/menu-catalog/menu-catalog.module.ts`
- `backend/src/menu-catalog/menu-catalog.commands.ts`
- `backend/src/menu-catalog/domain/menu-catalog.errors.ts`
- `backend/src/identity-access/auth/backoffice-auth.guard.ts`
- `backend/test/menu-catalog.integration.spec.ts`
- `backend/test/backoffice-role-guard.spec.ts`

## Ключевые факты из источников

- All menu catalog endpoints belong to backoffice boundary and require capability `menu`.
- Static backoffice endpoints without `:capability` use metadata decorator with canonical capability and common `BackofficeAuthGuard`.
- `invalid-drink-size-model` and `invalid-option-group-rule` map to `400 Bad Request`.
- A user without capability `menu` receives the documented backoffice capability error, not a catalog domain error.
- Endpoint paths and DTO shapes must match `docs/system/contracts/menu-and-availability-management.md`.

## Разрешенная зона правок

- `backend/src/menu-catalog/**`
- `backend/src/identity-access/auth/backoffice-auth.guard.ts`
- `backend/test/menu-catalog.integration.spec.ts`
- `backend/test/backoffice-role-guard.spec.ts`
- `BE-002-execution-plan.md`

## Запрещенная зона правок

- `.references/**`
- `frontend/**`
- `e2e/**`
- `docs/**`
- Identity-access files other than `backend/src/identity-access/auth/backoffice-auth.guard.ts`.
- Files from other BE-002 context packages except `BE-002-execution-plan.md`.

## Входы и зависимости

- BE-002-01 must be completed or explicitly no-op with evidence.
- BE-002-03 depends on this subtask being completed or explicitly recorded as no-op with evidence.

## Ожидаемый результат

Integration tests prove that menu catalog endpoints are capability-protected and return canonical domain/auth errors without altering the documented contract.

## Проверки

- `npm test --prefix backend -- menu-catalog.integration backoffice-role-guard`
- `npm run typecheck --prefix backend`

## Критерии готовности

- Integration tests cover successful administrator menu catalog management.
- Integration tests cover `invalid-drink-size-model`, `invalid-option-group-rule`, and capability denial.
- `BE-002-execution-plan.md` marks BE-002-02 as `completed`.

## Риски и запреты

- Do not introduce a separate auth model for menu catalog.
- Do not change `POST /backoffice/auth/session` or `GET /backoffice/:capability`.
- Do not move domain validation into controller tests.

## Открытые вопросы

- Нет.
