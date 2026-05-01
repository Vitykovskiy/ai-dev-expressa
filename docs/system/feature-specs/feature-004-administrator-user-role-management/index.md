# Feature Package: FEATURE-004 Administrator User Role Management

## Назначение

Документ является entry slice decomposed feature package для `FEATURE-004`.

Feature package задает системный handoff для просмотра пользователей и назначения ролей во внутреннем административном контуре. Package остается в status `draft`, потому что источник не разрешает blocker по назначению роли `administrator`.

## Package slices

```text
docs/system/feature-specs/feature-004-administrator-user-role-management/
|-- index.md
|-- behavior.md
|-- interfaces.md
|-- ui-behavior.md
|-- test-scenarios.md
```

- `index.md` — feature boundary, source trace, affected roles/interfaces, package navigation, role read routes.
- `behavior.md` — workflows, entity view, invariants, validations, errors, edge cases, scope/safety constraints.
- `interfaces.md` — frontend/backend/devops-relevant contracts, operations, inputs/outputs, guards, error mapping, test-mode/runtime constraints.
- `ui-behavior.md` — screen/surface mapping, UI states, visibility, guarded states, `.references` links and design readiness.
- `test-scenarios.md` — stable scenario IDs, manual QA route, e2e coverage expectation, required assertions and coverage mapping.

## Владение

- Системный аналитик создает и обновляет feature package на основании canonical sources.
- Архитектор использует `index.md` как первый маршрут чтения после снятия blocker.
- Frontend, Backend, DevOps и QA читают только назначенные package slices, профильные architecture docs и точечные supporting sources.
- Manual QA и E2E QA используют `test-scenarios.md` как общий QA slice package.

## Карточка документа

- Feature: `FEATURE-004`
- Parent sprint: `SPRINT-001`
- Package root: `docs/system/feature-specs/feature-004-administrator-user-role-management/`
- Status: `draft`
- Related roles: `Системный аналитик`, `Архитектор`, `Frontend`, `Backend`, `DevOps`, `QA`
- Affected interfaces: вкладка `Пользователи`, `Read users for role management`, `Assign user role`, role/capability guard, users UI reference
- Last consistency check: `2026-05-01`

## Package Navigation

- Behavior: `./behavior.md`
- Interfaces: `./interfaces.md`
- UI behavior: `./ui-behavior.md`
- Test scenarios: `./test-scenarios.md`

## Source Trace

### Business input

- `tasks/FEATURE-004-administrator-user-role-management.md`

### System sources

- `use-cases`: `docs/system/use-cases/administrator-manage-users-and-roles.md`
- `contracts`: `docs/system/contracts/user-role-and-blocking-management.md`
- `domain-model`: `docs/system/domain-model/identity-and-access.md`
- `state-models`: `n/a`
- `ui-behavior-mapping`: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

### UI sources

- `ui-contract`: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `versioned design sources`:
  - `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
  - `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
  - `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
  - `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
  - `.references/Expressa_admin/src/app/types.ts`
- `prototype verification status`: `verified-for-role-assignment`
- `design correction tasks`: `n/a`
- `design readiness result`: `ready`

## Feature Boundary

### Included scope

- Система должна предоставить administrator список пользователей во вкладке `Пользователи`.
- Система должна позволить administrator выбрать пользователя и назначить роль `barista`.
- Система должна включить назначение роли `administrator` в scope фичи после снятия blocker по guard-правилу.
- Система должна пересчитать доступ целевого пользователя к вкладкам внутреннего административного контура после успешного изменения роли.
- Система должна сохранить связь UI flow с `.references/Expressa_admin` для вкладки `Пользователи` и диалога назначения роли.

### Explicitly excluded scope

- Блокировка пользователя находится вне scope `FEATURE-004`.
- Разблокировка пользователя находится вне scope `FEATURE-004`.
- Создание нового пользователя находится вне scope `FEATURE-004`.
- Снятие роли `barista` находится вне scope `FEATURE-004`.
- Изменение роли `customer` находится вне scope `FEATURE-004`.
- Production-code implementation находится вне scope текущей task-card системного аналитика.

### Business outcome

- Система должна дать administrator проверяемый сценарий просмотра пользователей, назначения роли и пересчета доступа к вкладкам внутреннего административного контура.

### Dependencies

- `FEATURE-001` обеспечивает backoffice entry, authenticated actor, role-aware navigation and direct-route guard.
- `docs/system/contracts/backoffice-auth-and-capability-access.md` остается supporting source для auth/capability guard.
- `docs/architecture/application-map/frontend-backoffice.md` и `docs/architecture/application-map/backend-access.md` используются следующими ролями как контурные карты.

## Role Read Routes

### Архитектор

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`

### Frontend

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`

### Backend

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/architecture/application-map/backend-access.md`

### DevOps

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

### Manual QA

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/qa-standards.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`

### E2E QA

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

## Supporting Sources Policy

- Supporting source включается в role read route только если роль не может выполнить задачу из package slices без потери точности.
- Package slices фиксируют feature-specific выводы и не заменяют canonical source documents.
- Если необходимый факт отсутствует в package и supporting sources, системный аналитик фиксирует blocker или open question.

## Blockers

- Не согласовано, может ли любой `administrator` назначать других `administrator`, или это право ограничено только главным `administrator`.
- До снятия blocker package не получает статус `ready-for-architecture`.

## Design Handoff Status

- Current status: `ready`
- Required designer task: `n/a`
- Updated approved UI source: `n/a`
- Recheck result: `verified-for-role-assignment`

## Architecture Handoff Checklist

- Система должна иметь готовые package slices: index, behavior, interfaces, ui-behavior и test-scenarios. Status: `done`.
- Система должна иметь явную feature boundary. Status: `done`.
- Система должна иметь role read routes для Архитектор, Frontend, Backend, DevOps, Manual QA и E2E QA. Status: `done`.
- Система должна иметь перечисленные user workflows в behavior slice. Status: `done`.
- Система должна иметь interaction, input, validation, error, guard и runtime boundaries в соответствующих package slices. Status: `done`.
- Система должна иметь UI behavior и design readiness в ui-behavior slice. Status: `done`.
- Система должна иметь закрытые blocking DESIGN-\* задачи или явный `n/a`. Status: `done`.
- Система должна иметь test-scenarios slice со stable scenario IDs и coverage mapping. Status: `done`.
- Система должна иметь снятый blocker по назначению роли `administrator` до архитектурной декомпозиции. Status: `blocked`.
