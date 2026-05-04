# Feature Package: FEATURE-005 Administrator User Blocking

## Карточка документа

- Feature: `FEATURE-005`
- Parent sprint: `SPRINT-001`
- Package root: `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/`
- Status: `ready-for-architecture`
- Related roles: `Системный аналитик`, `Архитектор`, `Frontend`, `Backend`, `DevOps`, `QA`
- Affected interfaces: `backoffice users surface`, `Block user`, `Read users for role management`, `application access for blocked user`
- Last consistency check: `2026-05-04`

## Package Navigation

- Behavior: [behavior.md](./behavior.md)
- Interfaces: [interfaces.md](./interfaces.md)
- UI behavior: [ui-behavior.md](./ui-behavior.md)
- Test scenarios: [test-scenarios.md](./test-scenarios.md)

## Source Trace

### Business input

- Task card: [tasks/FEATURE-005-administrator-user-blocking.md](../../../../tasks/FEATURE-005-administrator-user-blocking.md)

### System sources

- `use-cases`: [docs/system/use-cases/administrator-block-user.md](../../use-cases/administrator-block-user.md)
- `contracts`: [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- `domain-model`: [docs/system/domain-model/identity-and-access.md](../../domain-model/identity-and-access.md)
- `state-models`: `n/a`
- `ui-behavior-mapping`: [docs/system/ui-behavior-mapping/backoffice-ui-binding.md](../../ui-behavior-mapping/backoffice-ui-binding.md)

### UI sources

- `ui-contract`: `n/a`
- `versioned design sources`: [.references/Expressa_admin/src/app/screens/UsersScreen.tsx](../../../../.references/Expressa_admin/src/app/screens/UsersScreen.tsx), [.references/Expressa_admin/src/app/components/ConfirmDialog.tsx](../../../../.references/Expressa_admin/src/app/components/ConfirmDialog.tsx)
- `prototype verification status`: `verified`
- `design correction tasks`: `n/a`
- `design readiness result`: `ready`

## Feature Boundary

### Included scope

- Система должна позволять пользователю с ролью `administrator` инициировать блокировку существующего пользователя из контура `users`.
- Система должна сохранять для целевого пользователя состояние `blocked`.
- Система должна прекращать доступ заблокированного пользователя к приложению.
- Система должна возвращать или отображать обновленное представление пользователя со статусом `blocked`.

### Explicitly excluded scope

- `FEATURE-005` не включает разблокировку пользователя.
- `FEATURE-005` не включает изменение правил назначения ролей.
- `FEATURE-005` не включает изменение bootstrap главного `administrator`.
- `FEATURE-005` не определяет новое поведение повторной блокировки уже заблокированного пользователя.

### Business outcome

- Система должна завершать сценарий тем, что выбранный пользователь имеет статус `blocked` и не может пользоваться приложением.

### Dependencies

- `FEATURE-001` как базовая зависимость task-card.
- Canonical sources listed in `Source Trace`.
- Versioned UI sources listed in `UI sources`.

## Role Read Routes

### Архитектор

- [index.md](./index.md)
- [behavior.md](./behavior.md)
- [interfaces.md](./interfaces.md)
- [ui-behavior.md](./ui-behavior.md)
- [test-scenarios.md](./test-scenarios.md)
- [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- [docs/system/domain-model/identity-and-access.md](../../domain-model/identity-and-access.md)

### Frontend

- [index.md](./index.md)
- [behavior.md](./behavior.md)
- [interfaces.md](./interfaces.md)
- [ui-behavior.md](./ui-behavior.md)
- [test-scenarios.md](./test-scenarios.md)
- [docs/system/ui-behavior-mapping/backoffice-ui-binding.md](../../ui-behavior-mapping/backoffice-ui-binding.md)
- [.references/Expressa_admin/src/app/screens/UsersScreen.tsx](../../../../.references/Expressa_admin/src/app/screens/UsersScreen.tsx)
- [.references/Expressa_admin/src/app/components/ConfirmDialog.tsx](../../../../.references/Expressa_admin/src/app/components/ConfirmDialog.tsx)

### Backend

- [index.md](./index.md)
- [behavior.md](./behavior.md)
- [interfaces.md](./interfaces.md)
- [test-scenarios.md](./test-scenarios.md)
- [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- [docs/system/domain-model/identity-and-access.md](../../domain-model/identity-and-access.md)

### DevOps

- [index.md](./index.md)
- [interfaces.md](./interfaces.md)
- [test-scenarios.md](./test-scenarios.md)
- DevOps architecture docs only if architecture decomposition assigns a runtime, deployment, seed, or test-target change.

### Manual QA

- [index.md](./index.md)
- [behavior.md](./behavior.md)
- [ui-behavior.md](./ui-behavior.md)
- [test-scenarios.md](./test-scenarios.md)
- [.references/Expressa_admin/src/app/screens/UsersScreen.tsx](../../../../.references/Expressa_admin/src/app/screens/UsersScreen.tsx)

### E2E QA

- [index.md](./index.md)
- [behavior.md](./behavior.md)
- [interfaces.md](./interfaces.md)
- [ui-behavior.md](./ui-behavior.md)
- [test-scenarios.md](./test-scenarios.md)

## Supporting Sources Policy

- Supporting source включается в role read route только если package slices не покрывают точный контур роли.
- `.references` источники используются только для проверки UI entrypoint, action binding, состояния `blocked` и design readiness.
- Production code не является источником контракта для этой фичи.

## Blockers

- Нет.

## Design Handoff Status

- Current status: `ready`
- Required designer task: `n/a`
- Updated approved UI source: `n/a`
- Recheck result: `verified`

## Architecture Handoff Checklist

- Система должна иметь готовые package slices: `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md` и `test-scenarios.md`.
- Система должна иметь явную feature boundary без `unblock_user`.
- Система должна иметь role read routes для `Архитектор`, `Frontend`, `Backend`, `DevOps`, `Manual QA` и `E2E QA`.
- Система должна иметь пользовательский workflow блокировки в behavior slice.
- Система должна иметь interaction, input, validation, error, guard и runtime boundaries в соответствующих package slices.
- Система должна иметь UI behavior и design readiness в `ui-behavior.md`.
- Система должна иметь `test-scenarios.md` со stable Scenario IDs и coverage mapping.
- Система должна быть готова к архитектурной декомпозиции без чтения широкого `docs/system` и без обращения к production code.
