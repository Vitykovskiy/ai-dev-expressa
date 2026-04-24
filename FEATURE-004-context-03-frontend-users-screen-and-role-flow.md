# Контекстный пакет `FEATURE-004` — `03 Frontend users screen and role flow`

## Карточка контекста

- Исходная задача: `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- Подзадача: `03 — frontend users route handoff`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `frontend contour map, frontend child task, frontend handoff for /users route and server-driven role assignment flow`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Сделать frontend handoff FEATURE-004 self-contained: зафиксировать /users route, users-flow loading path, availableRoleAssignments и scope boundary без обращения к backend implementation.`

## Поведенческий промпт исполнителя

```text
You operate as architect.

Complete only the frontend users route handoff subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- `tasks/FE-001-feature-004-users-screen-and-role-assignment.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- `FEATURE-004-context-01-architecture-handoff.md`

## Ключевые факты из источников

- Frontend route `/users` использует `GET /backoffice/users` как канонический direct-route и data boundary, а не generic capability probe: `feature-004-administrator-user-role-management.md`, `frontend-backoffice.md`, `backoffice-ui-binding.md`.
- Route-level visibility для вкладки `Пользователи` опирается на `AuthenticatedActor.capabilities`, но direct-route загрузка и server-confirmed access check остаются на `GET /backoffice/users`: `backoffice-auth-and-capability-access.md`, `feature-004-administrator-user-role-management.md`, `frontend-backoffice.md`.
- Форма назначения роли должна брать допустимые варианты из `availableRoleAssignments` и не восстанавливать guard `BootstrapAdministrator` из frontend-кода: `feature-004-administrator-user-role-management.md`, `user-role-and-blocking-management.md`, `frontend-backoffice.md`.
- Success state после `PATCH /backoffice/users/{userId}/role` должен подтверждать операцию уведомлением и повторно читать список пользователей, а error state должен сохранять screen/dialog context без ложного success: `feature-004-administrator-user-role-management.md`, `user-role-and-blocking-management.md`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`.
- UI reference показывает соседние actions `block/unblock`, но handoff FEATURE-004 обязан удерживать их вне scope: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `feature-004-administrator-user-role-management.md`, `backoffice-ui-binding.md`.

## Разрешенная зона правок

- `docs/architecture/application-map/frontend-backoffice.md`
- `tasks/FE-001-feature-004-users-screen-and-role-assignment.md`
- `FEATURE-004-context-03-frontend-users-screen-and-role-flow.md`

## Запрещенная зона правок

- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/deployment-map.md`
- `frontend/**`
- `backend/**`
- `e2e/**`
- `.references/**`

## Входы и зависимости

- Вход: architecture baseline из `FEATURE-004-context-01-architecture-handoff.md`.
- От результата зависят `QA-001`, `QA-002` и финальная интеграция handoff.

## Ожидаемый результат

`frontend-backoffice map, task FE-001 и frontend context package явно описывают /users route, states, role assignment flow и scope boundary FEATURE-004.`

## Проверки

- `Сверка frontend-backoffice map с feature spec и ui-behavior mapping`
- `Сверка FE-001 read set с auth contract, ui contract, reference files и users contract`
- `Проверка, что FE-001 не требует backend-код или BE-карточки`

## Критерии готовности

- Frontend map явно фиксирует `GET /backoffice/users` как users-flow boundary.
- FE-001 read set покрывает route `/users`, route-level auth/capability behavior, states, availableRoleAssignments и scope boundary.
- Frontend context package достаточен для выполнения FE-001 без чтения backend implementation.

## Риски и запреты

- Риск: визуальное сходство users management surface может подтолкнуть к включению block/unblock в scope.
- Запрет: не менять `.references` и не вводить новые UI sources.

## Открытые вопросы

- `нет`
