# Interfaces: FEATURE-004 Administrator User Role Management

## Карточка документа

- Feature: `FEATURE-004`
- Package root: `docs/system/feature-specs/feature-004-administrator-user-role-management/`
- Index: `./index.md`
- Status: `draft`
- Last consistency check: `2026-05-01`

## Interface Boundary

### Affected interfaces

- Вкладка внутреннего административного контура `Пользователи`.
- Contract `Read users for role management`.
- Contract `Assign user role`.
- Role/capability guard для доступа к вкладке `Пользователи`.
- Role/capability recalculation после изменения роли пользователя.

### Non-affected interfaces

- `Block user`.
- `unblock_user`.
- `revoke_barista`.
- Создание нового пользователя.
- Customer Telegram entry.
- Управление меню, заказами, доступностью и настройками слотов.

### Consumers and providers

| Consumer            | Provider                         | Interaction                                                  | Source                                               |
| ------------------- | -------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| Backoffice frontend | Backend identity/access boundary | Получить список пользователей для вкладки `Пользователи`.    | `user-role-and-blocking-management.md`               |
| Backoffice frontend | Backend identity/access boundary | Назначить пользователю роль `barista` или `administrator`.   | `user-role-and-blocking-management.md`               |
| Backend role guard  | Backend identity/access boundary | Проверить, что текущий пользователь имеет `administrator`.   | `identity-and-access.md`                             |
| Backoffice frontend | Backend auth/capability boundary | Отразить обновленный доступ к вкладкам после изменения роли. | `identity-and-access.md`, `backoffice-ui-binding.md` |

## Operations

### `Read users for role management`

- Purpose: предоставить administrator список пользователей для выбора целевого пользователя.
- Consumer: `frontend`
- Provider: `backend`
- Trigger: открытие вкладки `Пользователи` или обновление списка.
- Inputs: текущий authenticated actor context.
- Outputs: список пользователей с `userId`, `telegramId`, текущими ролями, признаком `blocked`, человекочитаемой подписью при наличии.
- Guards: `administrator-role-required`.
- Side effects: `n/a`.
- Source: `docs/system/contracts/user-role-and-blocking-management.md`

### `Assign user role`

- Purpose: сохранить операционную роль пользователя и пересчитать доступ к вкладкам.
- Consumer: `frontend`
- Provider: `backend`
- Trigger: подтверждение роли в диалоге назначения роли.
- Inputs: текущий authenticated actor context, целевой `userId`, назначаемая роль.
- Outputs: обновленный набор ролей пользователя, обновленный доступ к вкладкам, обновленное представление пользователя.
- Guards: `administrator-role-required`; финальное правило назначения `administrator` остается blocker.
- Side effects: роль целевого пользователя изменяется; capabilities целевого пользователя пересчитываются.
- Source: `docs/system/contracts/user-role-and-blocking-management.md`

### `Check users capability access`

- Purpose: защитить вкладку `Пользователи` от пользователя без роли `administrator`.
- Consumer: `frontend`, browser route guard, backend guard.
- Provider: `backend`
- Trigger: вход во вкладку `Пользователи`, прямой route/API access.
- Inputs: authenticated actor context.
- Outputs: разрешение доступа или отказ.
- Guards: `administrator` capability.
- Side effects: `n/a`.
- Source: `docs/system/domain-model/identity-and-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

## Validation and Error Mapping

| Operation                        | Condition                                                      | System behavior                                                | User-visible outcome                        | Source                                 |
| -------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------- | -------------------------------------- |
| `Read users for role management` | Actor не имеет `administrator`                                 | Система должна отклонить чтение списка.                        | Отказ в доступе к вкладке или screen guard. | `user-role-and-blocking-management.md` |
| `Assign user role`               | Actor не имеет `administrator`                                 | Система должна отклонить изменение роли.                       | Ошибка `administrator-role-required`.       | `user-role-and-blocking-management.md` |
| `Assign user role`               | Role вне `barista` / `administrator`                           | Система должна отклонить изменение роли.                       | Ошибка `role-not-assignable`.               | `user-role-and-blocking-management.md` |
| `Assign user role`               | Target user отсутствует                                        | Система должна отклонить изменение роли.                       | Ошибка `user-not-found`.                    | `user-role-and-blocking-management.md` |
| `Assign user role`               | Role = `administrator` и финальное guard-правило не определено | Система должна удерживать operation boundary в status blocked. | Architecture handoff blocked.               | `FEATURE-004` blocker                  |

## Test-mode and Runtime Constraints

- Система должна использовать тот же authenticated actor context, который задан backoffice auth contract.
- Система должна поддерживать test-mode вход только при `NODE_ENV=test` и серверно разрешенном `DISABLE_TG_AUTH=true`.
- Система должна запрещать production bypass без Telegram entry.
- Система должна передавать role-management операции через серверный guard, даже если frontend уже скрыл или показал действие.
- FEATURE-004 не задает новые переменные окружения.
- FEATURE-004 не меняет deployment route.

## Data Contract Summary

### Inputs

- `targetUserId` — внутренний идентификатор целевого пользователя; required для `Assign user role`.
- `assignedRole` — назначаемая роль; required; allowed values: `barista`, `administrator`.
- `authenticated actor context` — текущий пользователь backoffice; required для чтения списка и назначения роли.

### Outputs

- `user list` — список пользователей для вкладки `Пользователи`.
- `user item.userId` — внутренний идентификатор пользователя.
- `user item.telegramId` — внешний Telegram identifier пользователя.
- `user item.roles` — текущие роли пользователя.
- `user item.blocked` — признак блокировки пользователя.
- `user item.displayLabel` — человекочитаемая подпись пользователя при наличии в источнике идентификации.
- `updated roles` — набор ролей целевого пользователя после назначения.
- `updated capabilities` — доступ целевого пользователя к вкладкам после пересчета.

### Canonical values

- Roles: `customer`, `barista`, `administrator`.
- Assignable roles in FEATURE-004: `barista`, `administrator`.
- Capability/tab values: `orders`, `availability`, `menu`, `users`, `settings`.
- Business errors: `administrator-role-required`, `role-not-assignable`, `user-not-found`.

## Role-specific Interface Notes

### Frontend

- Frontend должен получать список пользователей из серверного source of truth.
- Frontend должен отправлять только `targetUserId` и выбранную роль как operation input.
- Frontend должен использовать server response для обновления строки пользователя и доступов.
- Frontend должен показывать role assignment UI только в administrator-guarded surface.

### Backend

- Backend должен защищать чтение списка и назначение роли административным guard.
- Backend должен пересчитывать capabilities после изменения роли.
- Backend должен сохранить `customer`, если целевой пользователь уже имеет эту роль.
- Backend должен удержать назначение `administrator` вне final implementation до снятия blocker по guard-правилу.

### DevOps

- FEATURE-004 не требует новых runtime variables, deployment steps или smoke endpoints.
- DevOps route нужен только как supporting source для e2e acceptance path.

### E2E QA

- E2E QA должен проверять чтение списка, назначение `barista`, role/capability recalculation и denial для пользователя без `administrator`.
- E2E QA должен отложить автоматизацию финального назначения `administrator` до снятия blocker по guard-правилу.

## Traceability

- Source contracts: `docs/system/contracts/user-role-and-blocking-management.md`
- Source architecture docs: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Related behavior: `./behavior.md`
- Related UI behavior: `./ui-behavior.md`
- Related test scenarios: `./test-scenarios.md`

## Open Questions

- Кто имеет право назначать роль `administrator`: любой `administrator` или только главный `administrator`.
