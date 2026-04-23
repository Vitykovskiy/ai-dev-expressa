# Контекстный пакет QA-007/02

## Карточка контекста

- Исходная задача: `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- Подзадача: `02 — E2E Negative Validation And Access Guard`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `Playwright browser e2e для validation errors и capability guard`
- Связанный план: `QA-007-execution-plan.md`

## Цель подзадачи

Расширить FEATURE-003 browser e2e spec покрытием `FTS-003-003`, `FTS-003-004`, `FTS-003-005`.

## Поведенческий промпт исполнителя

```text
You operate as a strict QA engineer.

Complete only subtask 02 from QA-007 within the source task QA-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- `QA-007-execution-plan.md`
- `QA-007-context-01-positive-save-and-slot-generation.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/backend-access.md`
- `e2e/slot-settings/admin-slot-settings.spec.ts`
- `frontend/src/modules/navigation/tabs.ts`
- `frontend/src/router/index.ts`
- `frontend/src/router/guards.ts`
- `frontend/src/views/ForbiddenView.vue`
- `frontend/src/components/TabBar.vue`
- `frontend/src/components/SideNav.vue`
- `frontend/src/modules/slot-settings/presentation.ts`
- `frontend/src/modules/slot-settings/validation.ts`

## Ключевые факты из источников

- `FTS-003-003` requires `invalid-working-hours`, no success notification, editable form retained, and user-visible validation state.
- `FTS-003-004` requires `invalid-slot-capacity`, inline field error, rejected operation, and no application of invalid capacity.
- `FTS-003-005` requires settings tab hidden for a user without `settings` capability and protected/forbidden state for direct `/settings` access.
- Barista capability set is `orders`, `availability`; administrator capability set includes `settings`.

## Разрешенная зона правок

- `e2e/slot-settings/**`

## Запрещенная зона правок

- Production backend code.
- Production frontend code.
- Task cards and documentation, except this subtask may update only its own status line in `QA-007-execution-plan.md` when instructed to mark completion.

## Ожидаемый результат

The slot settings Playwright spec covers all negative/guard required scenarios with stable `FTS-003-*` IDs.

## Проверки

- `npm --prefix e2e test -- slot-settings` when a target environment is available.

## Критерии готовности

- `FTS-003-003 invalid working hours` appears in a Playwright test title or annotation.
- `FTS-003-004 invalid slot capacity` appears in a Playwright test title or annotation.
- `FTS-003-005 settings access guard` appears in a Playwright test title or annotation.
- Guard assertions verify both navigation visibility and direct route protection.

## Открытые вопросы

- Нет.
