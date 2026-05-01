# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/FEATURE-004-administrator-user-role-management.md`
- Подзадача: `01 — source trace and feature boundary`
- Роль исполнителя: `Системный аналитик`
- Контурная карта: `n/a`
- Зона ответственности: `docs/system/feature-specs/feature-004-administrator-user-role-management/`
- Связанный план: `.agent-work/FEATURE-004/execution-plan.md`

## Цель подзадачи

Зафиксировать подтвержденные источниками границы фичи, факты, противоречия и blocker перед написанием package slices.

## Поведенческий промпт исполнителя

```text
You operate as a system analyst.

Complete only the source trace and boundary subtask within FEATURE-004.

Use the assigned read set and record contradictions explicitly. Do not infer unresolved business rules from previous tasks or implementation code.
```

## Обязательный read set

- `tasks/FEATURE-004-administrator-user-role-management.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/use-cases/administrator-manage-users-and-roles.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`

## Ключевые факты из источников

- `identity-and-access.md`: допустимые роли пользователя — `customer`, `barista`, `administrator`.
- `identity-and-access.md`: `barista` видит вкладки `Заказы` и `Доступность`.
- `identity-and-access.md`: `administrator` видит вкладки `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- `user-role-and-blocking-management.md`: операция `Assign user role` принимает целевого пользователя и назначаемую роль `barista` или `administrator`.
- `administrator-manage-users-and-roles.md`: после назначения роли система сохраняет новое назначение и пересчитывает доступ к вкладкам backoffice.
- `backoffice-ui-binding.md`: экран `users` связан с `Assign user role`; действие `unblock_user` не подтверждено системными артефактами.
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`: экран поддерживает список пользователей, поиск, фильтры `Все` / `Баристы` / `Заблокированные`, меню действий и диалог назначения роли.
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`: диалог добавления пользователя не является активной точкой входа `UsersScreen` и содержит сценарий создания пользователя, который не входит в FEATURE-004.
- Дополнительная проверка из импортов `UsersScreen`: `AssignRoleDialog.tsx` содержит выбор `barista` и `administrator`.

## Разрешенная зона правок

- `docs/system/feature-specs/feature-004-administrator-user-role-management/`
- `docs/system/README.md`
- `tasks/FEATURE-004-administrator-user-role-management.md`
- `.agent-work/FEATURE-004/`

## Запрещенная зона правок

- Production-код.
- Тесты.
- Runtime-конфигурация.
- `.references/**`.
- Дочерние `AR-*`, `FE-*`, `BE-*`, `DO-*`, `QA-*` задачи.

## Входы и зависимости

- Эта подзадача завершена до записи package slices.
- Подзадачи `02`, `03`, `04` используют эти факты и blocker.

## Ожидаемый результат

Подтвержденный source trace для FEATURE-004 с явным blocker по назначению роли `administrator`.

## Проверки

- Сверить каждый факт с источником из read set.
- Не использовать архивные задачи и production-код как источник поведения.

## Критерии готовности

- Feature boundary отделяет role assignment от блокировки, разблокировки, создания пользователей и изменения роли `customer`.
- Blocker по назначению `administrator` сохранен.
- UI readiness проверяется только по versioned `.references`.

## Риски и запреты

- Риск: финализировать правило назначения `administrator` без источника.
- Запрет: менять `.references` вместо фиксации design readiness.

## Открытые вопросы

- Кто имеет право назначать роль `administrator`: любой `administrator` или только главный `administrator`.
