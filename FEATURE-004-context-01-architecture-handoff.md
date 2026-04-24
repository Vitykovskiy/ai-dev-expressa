# Шаблон контекстного пакета подзадачи

## Карточка контекста

- Исходная задача: `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- Подзадача: `01 — архитектурный handoff и обновление карт`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/deployment-map.md` при необходимости, `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`, `tasks/BE-001-feature-004-users-postgresql-and-role-api.md`, `tasks/FE-001-feature-004-users-screen-and-role-assignment.md`, `tasks/DO-010-feature-004-postgresql-runtime-and-delivery.md`, `tasks/QA-001-feature-004-manual-user-role-management.md`, `tasks/QA-002-feature-004-e2e-user-role-management.md`, `AR-007-execution-plan.md`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Обновить архитектурные карты и handoff FEATURE-004 так, чтобы users flow, PostgreSQL persistence и runtime path были явно зафиксированы, а дочерние FE, BE, DO и QA карточки имели self-contained read set без необходимости читать production-код соседнего контура.`

## Поведенческий промпт исполнителя

```text
You operate as architect.

Complete only the architecture handoff and map update subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/deployment-map.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`

## Ключевые факты из источников

- `feature-004-administrator-user-role-management.md`: фича охватывает только просмотр пользователей и назначение ролей `barista` и `administrator`; `block_user` и `unblock_user` явно исключены из scope.
- `feature-004-administrator-user-role-management.md` и `stack.md`: production-ready handoff обязан фиксировать постоянное хранение пользователей, ролей и `blocked state` в `PostgreSQL`.
- `user-role-and-blocking-management.md`: backend contract должен оставаться явным на уровне `GET /backoffice/users` и `PATCH /backoffice/users/{userId}/role`, включая `availableRoleAssignments`, без восстановления из исходного кода.
- `backoffice-ui-binding.md` и `.references/Expressa_admin`: экран `users` визуально соседствует с `block_user` и `unblock_user`, но `FEATURE-004` должна сохранить отдельную границу и не смешивать эти операции.
- `AR-007` task card: дочерние `FE/BE/DO/QA` задачи должны иметь self-contained read set без необходимости читать production-код соседнего контура.

## Разрешенная зона правок

- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/deployment-map.md`
- `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- `tasks/BE-001-feature-004-users-postgresql-and-role-api.md`
- `tasks/FE-001-feature-004-users-screen-and-role-assignment.md`
- `tasks/DO-010-feature-004-postgresql-runtime-and-delivery.md`
- `tasks/QA-001-feature-004-manual-user-role-management.md`
- `tasks/QA-002-feature-004-e2e-user-role-management.md`
- `AR-007-execution-plan.md`

## Запрещенная зона правок

- `backend/src/**`
- `frontend/src/**`
- `e2e/**`
- `docs/system/**`
- `.references/**`

## Входы и зависимости

- `Вход`: актуальные feature spec, test scenarios, contract и контурные карты из read set.
- `Выход`: обновленные архитектурные карты и согласованные дочерние карточки, на которые опираются шаги 2-6 плана.

## Ожидаемый результат

`Архитектурный handoff по FEATURE-004 зафиксирован в docs/architecture и child task cards: users flow отделен от block/unblock, PostgreSQL runtime path описан, а read set дочерних задач самодостаточен.`

## Проверки

- `Сверка child task read set с docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `Сверка child task read set с docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `Проверка, что contract GET /backoffice/users и PATCH /backoffice/users/{userId}/role остается явным в документации`
- `Проверка, что шаг 1 отмечен как done в AR-007-execution-plan.md`

## Критерии готовности

- `frontend-backoffice.md`, `backend-access.md` и `delivery-and-runtime.md` отражают users flow, PostgreSQL persistence и runtime path FEATURE-004.
- `deployment-map.md` обновлен, если handoff меняет env/config или deploy route.
- `BE-001`, `FE-001`, `DO-010`, `QA-001`, `QA-002` можно выполнять без чтения production-кода соседнего контура.

## Риски и запреты

- `Риск`: визуальный reference объединяет соседние user-management actions и может спровоцировать смешение scope.
- `Запрет`: нельзя делегировать дочерним задачам догадку об API shape, runtime path, guard semantics или QA route.

## Открытые вопросы

- `нет`
