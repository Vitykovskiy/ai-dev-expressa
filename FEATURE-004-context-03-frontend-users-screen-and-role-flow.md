# Шаблон контекстного пакета подзадачи

## Карточка контекста

- Исходная задача: `tasks/FE-001-feature-004-users-screen-and-role-assignment.md`
- Подзадача: `03 — frontend users screen и role assignment flow`
- Роль исполнителя: `Фронтенд`
- Зона ответственности: `frontend/src/**`, `frontend/test/**`, `docs/architecture/application-map/frontend-backoffice.md`, `AR-007-execution-plan.md`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Реализовать route /users по каноническому users flow из system artifacts и .references, не смешивая назначение ролей с block_user или unblock_user.`

## Поведенческий промпт исполнителя

```text
You operate as frontend.

Complete only the frontend users screen and role flow subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/FE-001-feature-004-users-screen-and-role-assignment.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- `FEATURE-004-context-03-frontend-users-screen-and-role-flow.md`

## Ключевые факты из источников

- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`: канонический экран содержит поиск, фильтры, список пользователей и кнопку `Добавить пользователя` как entrypoint сценария назначения роли.
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`: канонический диалог требует `name`, `telegramUsername` и `role`; submit должен оставаться недоступным до заполнения обязательных полей.
- `feature-004-administrator-user-role-management.md`: UI обязан поддержать loading, empty, success, error, inline validation и guarded states на существующем route `/users`.
- `user-role-and-blocking-management.md`: frontend работает только через `GET /backoffice/users` и `PATCH /backoffice/users/{userId}/role`, включая `availableRoleAssignments` и server-driven errors.
- `backoffice-ui-binding.md`: экран `users` визуально соседствует с `block_user` и `unblock_user`, но `FEATURE-004` не должна включать эти действия в поведение и acceptance.

## Разрешенная зона правок

- `frontend/src/**`
- `frontend/test/**`
- `docs/architecture/application-map/frontend-backoffice.md`
- `AR-007-execution-plan.md`

## Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `docs/system/**`
- `.references/**`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/deployment-map.md`

## Входы и зависимости

- `Вход`: завершенный шаг 1 плана; backend implementation из шага 2 может использоваться как доступный API, но read route остается документационным.
- `Выход`: готовый users UI flow для ручной и e2e QA.

## Ожидаемый результат

`Клиентский route /users реализует поиск, фильтрацию, список, диалог назначения роли, success/error handling и UI parity по .references без выхода в block/unblock scope.`

## Проверки

- `npm --prefix frontend run lint`
- `npm --prefix frontend run stylelint`
- `npm --prefix frontend run format:check`
- `npm --prefix frontend run typecheck`
- `npm --prefix frontend test`
- `npm --prefix frontend run build`

## Критерии готовности

- `/users` работает по contract `GET /backoffice/users` и `PATCH /backoffice/users/{userId}/role`.
- `availableRoleAssignments` и guard-path `administrator-role-assignment-forbidden` отражаются в UI без ложного success state.
- `AR-007-execution-plan.md` обновлен: шаг 3 имеет статус `done`.

## Риски и запреты

- `Риск`: визуальный reference показывает соседние actions на users screen и может спровоцировать лишний UI scope.
- `Запрет`: нельзя восстанавливать API shape, error mapping или role guard из backend source вместо системных артефактов.

## Открытые вопросы

- `нет`
