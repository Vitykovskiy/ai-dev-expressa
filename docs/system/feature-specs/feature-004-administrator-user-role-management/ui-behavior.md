# UI Behavior: FEATURE-004 Administrator User Role Management

## Карточка документа

- Feature: `FEATURE-004`
- Package root: `docs/system/feature-specs/feature-004-administrator-user-role-management/`
- Index: `./index.md`
- UI scope status: `applicable`
- Status: `ready-for-architecture`
- Last consistency check: `2026-05-01`

## UI Sources

- `ui-contract`: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `ui-behavior-mapping`: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `versioned design sources`:
  - `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
  - `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
  - `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
  - `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
  - `.references/Expressa_admin/src/app/types.ts`
- `prototype verification status`: `verified-for-role-assignment`
- `design correction tasks`: `n/a`

## System-relevant UI States

- Empty state: Система должна показать состояние `Пользователей нет`, если список пользователей пуст.
- Loading state: Система должна удерживать рабочий экран в состоянии ожидания данных до получения списка пользователей.
- Success state: Система должна показать обновленную строку пользователя и подтверждение успешного назначения роли.
- Error state: Система должна показать ошибку чтения списка или сохранения роли без изменения последнего подтвержденного состояния пользователя.
- Disabled state: Система должна отключить подтверждение назначения роли, если выбранная роль не может быть отправлена как допустимый input.
- Hidden state: Система должна скрывать вкладку `Пользователи` для пользователя без роли `administrator`.
- Guarded state: Система должна переводить прямой переход к `Пользователи` в отказ доступа, если capability запрещена.
- Confirmation state: Система должна требовать явное подтверждение роли в диалоге назначения.
- Notification state: Система должна показать успешное подтверждение после сохранения роли.
- Inline error state: Система должна показать ошибку формы или операции рядом с действием назначения роли, если сохранение не выполнено.

## UI Element Action Sequence

### Screen or surface

- `users`
- `AssignRoleDialog`
- `UserActionsMenu`

### Element-to-action mapping

| UI element                  | User action              | System reaction                                                                                                       | Related behavior or interface                               | Source                                        |
| --------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| Вкладка `Пользователи`      | Открыть экран            | Система должна прочитать список пользователей через administrator-guarded boundary.                                   | `./interfaces.md#read-users-for-role-management`            | `UsersScreen.tsx`, `backoffice-ui-binding.md` |
| Поле поиска                 | Ввести имя или Telegram  | Система должна отфильтровать отображаемый список по экранному query.                                                  | `./behavior.md#main-workflow-просмотр-пользователей`        | `UsersScreen.tsx`                             |
| Фильтр `Все`                | Выбрать фильтр           | Система должна показать всех пользователей из полученного списка.                                                     | `./behavior.md#main-workflow-просмотр-пользователей`        | `UsersScreen.tsx`                             |
| Фильтр `Баристы`            | Выбрать фильтр           | Система должна показать пользователей с операционной ролью `barista`.                                                 | `./behavior.md#main-workflow-просмотр-пользователей`        | `UsersScreen.tsx`                             |
| Фильтр `Заблокированные`    | Выбрать фильтр           | Система должна показать пользователей с `blocked=true` без включения блокировки или разблокировки в scope фичи.       | `./behavior.md#scope-constraints`                           | `UsersScreen.tsx`                             |
| Меню действий пользователя  | Выбрать `Назначить роль` | Система должна открыть диалог выбора роли для выбранного пользователя.                                                | `./behavior.md#main-workflow-назначение-роли-barista`       | `UsersScreen.tsx`, `UserActionsMenu.tsx`      |
| `AssignRoleDialog`          | Выбрать `Бариста`        | Система должна подготовить input `assignedRole=barista`.                                                              | `./interfaces.md#assign-user-role`                          | `AssignRoleDialog.tsx`                        |
| `AssignRoleDialog`          | Выбрать `Администратор`  | Система должна подготовить input `assignedRole=administrator`; сохранение должно пройти guard главного administrator. | `./behavior.md#main-workflow-назначение-роли-administrator` | `AssignRoleDialog.tsx`                        |
| Кнопка `Назначить роль`     | Подтвердить выбор        | Система должна отправить role assignment operation и показать результат операции.                                     | `./interfaces.md#assign-user-role`                          | `AssignRoleDialog.tsx`                        |
| Кнопка `Отмена` или overlay | Закрыть диалог           | Система должна закрыть диалог без изменения роли пользователя.                                                        | `./behavior.md#main-workflow-назначение-роли-barista`       | `AssignRoleDialog.tsx`                        |

### Interaction notes

- Система должна использовать вкладку `Пользователи` как administrator-only surface.
- Система должна сохранять блокировку и разблокировку вне scope FEATURE-004, даже если действия присутствуют в `UserActionsMenu`.
- Система должна сохранять снятие роли `barista` вне scope FEATURE-004, даже если действие присутствует в `UserActionsMenu`.
- Система должна сохранять создание нового пользователя вне scope FEATURE-004, даже если `AddUserDialog` существует в `.references`.

## Design Readiness Audit

### Current prototype status

- `complete-for-role-assignment`

### Audit checklist

- Screen `users`: найден в `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`.
- Search and filters: найдены в `UsersScreen.tsx`.
- Role assignment entrypoint: найден в `UserActionsMenu.tsx` как `Назначить роль`.
- Role assignment dialog: найден в `AssignRoleDialog.tsx`.
- Role choices `barista` and `administrator`: найдены в `AssignRoleDialog.tsx`.
- Success notification: найдено в `UsersScreen.tsx`.
- Out-of-scope actions `block_user`, `unblock_user`, `revoke_barista`: найдены и зафиксированы как не входящие в FEATURE-004.
- Out-of-scope `AddUserDialog`: найден и зафиксирован как не входящий в FEATURE-004.

### Design gaps and required prototype corrections

- Gap: `n/a`
  - Required correction: `n/a`
  - Designer brief task: `n/a`
  - Canonical source: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`

### Repeated verification result

- `verified against current Git-tracked prototype for role assignment`

### Design handoff rule

- Design readiness по экранному входу назначения роли имеет статус `ready`.
- Architecture handoff по FEATURE-004 имеет статус `ready-for-architecture`; системное правило назначения роли `administrator` ограничено главным administrator.
- `DESIGN-*` task не требуется, потому что required role assignment UI entrypoint и выбор ролей присутствуют в `.references`.

## Role-specific UI Notes

### Frontend

- Frontend должен повторить users-screen flow из `.references/Expressa_admin`.
- Frontend должен сохранить out-of-scope actions вне behavior scope FEATURE-004.
- Frontend должен получать final authorization и обновленные roles/capabilities от backend.

### Manual QA

- Manual QA должен проверить parity вкладки `Пользователи`, меню действия `Назначить роль`, диалога выбора роли и состояний success/error.
- Manual QA должен считать `block_user`, `unblock_user`, `revoke_barista` и создание пользователя out-of-scope для FEATURE-004.

### E2E QA

- E2E QA должен покрыть открытие вкладки `Пользователи`, выбор пользователя, назначение `barista` и проверку пересчета доступа.
- E2E QA должен покрыть denial для пользователя без `administrator`.
- E2E QA должен покрыть назначение `administrator` главным administrator и отказ для administrator, который не является главным administrator.

## Traceability

- Related behavior: `./behavior.md`
- Related interfaces: `./interfaces.md`
- Related test scenarios: `./test-scenarios.md`
- Source UI mapping: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Source design files:
  - `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
  - `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
  - `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
  - `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
  - `.references/Expressa_admin/src/app/types.ts`

## Open Questions

- Отсутствуют.
