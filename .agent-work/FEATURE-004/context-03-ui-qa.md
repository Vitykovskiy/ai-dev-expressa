# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/FEATURE-004-administrator-user-role-management.md`
- Подзадача: `03 — UI behavior and QA scenarios slices`
- Роль исполнителя: `Системный аналитик`
- Контурная карта: `n/a`
- Зона ответственности: `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- Связанный план: `.agent-work/FEATURE-004/execution-plan.md`

## Цель подзадачи

Создать UI behavior и QA slices с traceability к users reference, stable scenario IDs, manual route, e2e expectation и required assertions.

## Поведенческий промпт исполнителя

```text
You operate as a system analyst.

Complete only the UI behavior and QA scenario slices for FEATURE-004. Use versioned .references as UI input, not as an implementation target. Do not change approved UI source. Mark design readiness blocked when a required system decision remains unresolved.
```

## Обязательный read set

- `tasks/FEATURE-004-administrator-user-role-management.md`
- `.agent-work/FEATURE-004/context-01-source-boundary.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
- `.references/Expressa_admin/src/app/types.ts`

## Ключевые факты из источников

- `UsersScreen` показывает список, поиск, фильтр по роли/status и действия пользователя.
- `AssignRoleDialog` показывает выбор `barista` и `administrator`.
- `UserActionsMenu` содержит также `block_user`, `unblock_user` и `revoke_barista`; эти действия не входят в FEATURE-004.
- `AddUserDialog` задает создание нового пользователя; это не входит в FEATURE-004 и не является активной точкой входа из `UsersScreen`.
- UI readiness по required role assignment elements технически покрыта, но architecture handoff blocked из-за системного blocker по назначению `administrator`.

## Разрешенная зона правок

- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `.agent-work/FEATURE-004/execution-plan.md`

## Запрещенная зона правок

- `.references/**`.
- Production-код и тесты.
- Создание QA-задач.

## Входы и зависимости

- Зависит от подзадач `01` и `02`.
- Подзадача `04` использует итоговый design readiness status и scenario IDs.

## Ожидаемый результат

UI behavior slice и QA slice фиксируют states, actions, design readiness, stable scenario IDs, coverage matrix and required assertions.

## Проверки

- Каждый scenario ID связан с behavior/interface/UI slice.
- Сценарии не вводят новое поведение.
- Design readiness содержит ссылки на конкретные `.references`.

## Критерии готовности

- Manual QA route покрывает main, guard, negative and visual-parity checks.
- E2E expectation выделяет browser-coverable scenarios.
- Open blocker по `administrator` отражен в blocked scenario.

## Риски и запреты

- Риск: считать лишние UI-действия частью scope.
- Запрет: требовать от QA проверки поведения, которое не подтверждено package slices.

## Открытые вопросы

- Нужно ли после снятия blocker ограничить UI выбор `administrator` только главным administrator или оставить его доступным всем `administrator`.
