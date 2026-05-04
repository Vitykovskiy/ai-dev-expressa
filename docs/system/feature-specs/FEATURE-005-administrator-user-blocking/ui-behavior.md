# UI Behavior: FEATURE-005 Administrator User Blocking

## Карточка документа

- Feature: `FEATURE-005`
- Package root: `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/`
- Index: [index.md](./index.md)
- UI scope status: `applicable`
- Status: `ready-for-architecture`
- Last consistency check: `2026-05-04`

## UI Sources

- `ui-contract`: `n/a`
- `ui-behavior-mapping`: [docs/system/ui-behavior-mapping/backoffice-ui-binding.md](../../ui-behavior-mapping/backoffice-ui-binding.md)
- `versioned design sources`: [.references/Expressa_admin/src/app/screens/UsersScreen.tsx](../../../../.references/Expressa_admin/src/app/screens/UsersScreen.tsx), [.references/Expressa_admin/src/app/components/ConfirmDialog.tsx](../../../../.references/Expressa_admin/src/app/components/ConfirmDialog.tsx)
- `prototype verification status`: `verified`
- `design correction tasks`: `n/a`

## System-relevant UI States

- Empty state: Система должна показывать empty state пользователей, когда список пользователей для текущего фильтра пуст.
- Loading state: Система должна сохранять существующий loading behavior users surface без добавления нового системного состояния в рамках `FEATURE-005`.
- Success state: Система должна подтверждать administrator успешную блокировку пользователя.
- Error state: Система должна показывать отказ операции для `administrator-role-required` и `user-not-found`.
- Disabled state: Система должна считать действие повторной блокировки уже заблокированного пользователя не определенным текущими sources.
- Hidden state: Система должна скрывать `users` surface от ролей без административного доступа по существующим role guards.
- Guarded state: Система должна показывать рабочий users flow только actor с ролью `administrator`.
- Confirmation state: Система должна считать обязательное подтверждение блокировки не заданным текущими canonical sources.
- Notification state: Система должна показывать success notification после успешной блокировки.
- Inline error state: `n/a`; операция `Block user` не имеет пользовательского поля ввода в текущих sources.

## UI Element Action Sequence

### Screen or surface

- Backoffice `users` surface.

### Element-to-action mapping

| UI element                  | User action                                     | System reaction                                                                                                 | Related behavior or interface                                  | Source                                                                                                                   |
| --------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `FilterTabs.blocked`        | Administrator selects blocked filter            | Система должна показывать пользователей со статусом `blocked`.                                                  | [behavior.md](./behavior.md), [interfaces.md](./interfaces.md) | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`                                                             |
| `UserActionsMenu.onBlock`   | Administrator initiates block for selected user | Система должна выполнить `Block user` for target user.                                                          | [interfaces.md](./interfaces.md)                               | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md` |
| `toast.success` after block | System confirms success                         | Система должна показать administrator подтверждение успешной блокировки.                                        | [behavior.md](./behavior.md)                                   | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md` |
| `UserActionsMenu.onUnblock` | User action exists in reference source          | Scope constraint applies; `unblock_user` remains outside `FEATURE-005`.                                         | [index.md](./index.md)                                         | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md` |
| `ConfirmDialog`             | Destructive confirmation component exists       | Component is an available UI pattern; mandatory block confirmation is not fixed by a canonical behavior source. | [behavior.md](./behavior.md)                                   | `.references/Expressa_admin/src/app/components/ConfirmDialog.tsx`                                                        |

### Interaction notes

- Система должна bind UI action `users.block_user` to contract `Block user`.
- Система должна keep `users.unblock_user` outside the accepted behavior of `FEATURE-005`.
- Система должна use `blocked` status as the UI-relevant state after successful blocking.
- Система должна keep visual composition, colors, typography and spacing outside this system package.

## Design Readiness Audit

### Current prototype status

- `complete-for-system-handoff`

### Audit checklist

- Users surface exists in `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`.
- Block filter exists through `filterTabs.blocked`.
- `onBlock` action callback exists for `UserActionsMenu`.
- Success notification for block exists through `toast.success`.
- `onUnblock` exists in the reference source but is excluded by current system scope.
- Generic `ConfirmDialog` exists and supports destructive confirmation, but current system sources do not require it for block.

### Design gaps and required prototype corrections

- Gap: `n/a`
  - Required correction: `n/a`
  - Designer brief task: `n/a`
  - Canonical source: `n/a`

### Repeated verification result

- `verified against current Git-tracked prototype`

### Design handoff rule

- `ready-for-architecture` uses `prototype verification status: verified`.
- Blocking design gaps are not present for the system scope of `FEATURE-005`.
- `unblock_user` is a scope exclusion, not a required design correction for this feature.

## Role-specific UI Notes

### Frontend

- Frontend must implement only the block flow assigned by child task.
- Frontend must not add `unblock_user` behavior under `FEATURE-005`.
- Frontend must route guard and UI visibility through administrator access already defined for users surface.

### Manual QA

- Manual QA must verify that administrator can initiate block from users surface.
- Manual QA must verify that success state is visible after block.
- Manual QA must verify that `unblock_user` is not accepted as part of this feature.

### E2E QA

- E2E QA must assert the user-visible result of a successful block.
- E2E QA must assert blocked-user access denial when the QA target provides the necessary second actor or test-mode path.

## Traceability

- Related behavior: [behavior.md](./behavior.md)
- Related interfaces: [interfaces.md](./interfaces.md)
- Related test scenarios: [test-scenarios.md](./test-scenarios.md)
- Source UI mapping: [docs/system/ui-behavior-mapping/backoffice-ui-binding.md](../../ui-behavior-mapping/backoffice-ui-binding.md)
- Source design files: [.references/Expressa_admin/src/app/screens/UsersScreen.tsx](../../../../.references/Expressa_admin/src/app/screens/UsersScreen.tsx), [.references/Expressa_admin/src/app/components/ConfirmDialog.tsx](../../../../.references/Expressa_admin/src/app/components/ConfirmDialog.tsx)

## Open Questions

- Нет блокирующих вопросов для architecture handoff.
