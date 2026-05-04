# Interfaces: FEATURE-005 Administrator User Blocking

## Карточка документа

- Feature: `FEATURE-005`
- Package root: `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/`
- Index: [index.md](./index.md)
- Status: `ready-for-architecture`
- Last consistency check: `2026-05-04`

## Interface Boundary

### Affected interfaces

- Backoffice `users` surface for selecting a target user.
- Contract `Read users for role management`.
- Contract `Block user`.
- Application access checks affected by `User.blocked`.

### Non-affected interfaces

- `unblock_user`.
- `Assign user role`.
- `Bootstrap main administrator`.
- Menu, orders, availability and settings operations.

### Consumers and providers

| Consumer                          | Provider                        | Interaction                        | Source                                                       |
| --------------------------------- | ------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| `administrator` via backoffice UI | System user management boundary | Read users and choose target user  | `docs/system/contracts/user-role-and-blocking-management.md` |
| `administrator` via backoffice UI | System user management boundary | Block selected user                | `docs/system/contracts/user-role-and-blocking-management.md` |
| Blocked user                      | Application access boundary     | Access denied after `blocked=true` | `docs/system/domain-model/identity-and-access.md`            |

## Operations

### `Read users for role management`

- Purpose: provide administrator a list of users for choosing the blocking target.
- Consumer: `frontend`
- Provider: `backend`
- Trigger: administrator opens the `users` surface or refreshes users.
- Inputs: no required business inputs.
- Outputs: list of users with user identifier, Telegram identifier, roles, blocking flag and human-readable label when available.
- Guards: `administrator-role-required`.
- Side effects: `n/a`.
- Source: `docs/system/contracts/user-role-and-blocking-management.md`

### `Block user`

- Purpose: set selected user to blocked state and stop their access.
- Consumer: `frontend`
- Provider: `backend`
- Trigger: administrator initiates `block_user` for a selected target user.
- Inputs: target user.
- Outputs: user with status `blocked`.
- Guards: `administrator-role-required`.
- Side effects: blocked user loses access to the application.
- Source: `docs/system/contracts/user-role-and-blocking-management.md`

### `Apply blocked access state`

- Purpose: enforce the side effect of `Block user` at application access boundaries.
- Consumer: blocked user.
- Provider: application access boundary.
- Trigger: blocked user attempts to use the application after `blocked=true`.
- Inputs: authenticated or identifiable user state with `blocked=true`.
- Outputs: access is denied.
- Guards: `User.blocked`.
- Side effects: no additional side effects fixed by current sources.
- Source: `docs/system/domain-model/identity-and-access.md`

### Validation and error mapping

| Operation                        | Condition                        | System behavior                                                                   | User-visible outcome                  | Source                                                       |
| -------------------------------- | -------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| `Read users for role management` | Actor lacks `administrator` role | Система должна return `administrator-role-required`.                              | Access to users management is denied. | `docs/system/contracts/user-role-and-blocking-management.md` |
| `Block user`                     | Actor lacks `administrator` role | Система должна return `administrator-role-required` without changing target user. | Blocking is denied.                   | `docs/system/contracts/user-role-and-blocking-management.md` |
| `Block user`                     | Target user does not exist       | Система должна return `user-not-found` without confirming blocking.               | User not found is shown.              | `docs/system/contracts/user-role-and-blocking-management.md` |
| `Apply blocked access state`     | User has `blocked=true`          | Система должна deny application access.                                           | Application access is unavailable.    | `docs/system/domain-model/identity-and-access.md`            |

## Test-mode and Runtime Constraints

- No new production runtime variable is fixed by current sources for `FEATURE-005`.
- E2E QA needs an administrator actor and a target user that can be blocked.
- E2E QA needs a way to verify blocked-user access denial after the block operation.
- If architecture decomposition cannot provide the required actor, target user, seed data, test-mode route or QA target from existing project mechanisms, QA or architecture must create a resolver before e2e execution.

## Data Contract Summary

### Inputs

- `target user` — existing user selected by administrator; required.
- `actor` — identified user performing the operation; must have role `administrator`.

### Outputs

- `blocked user` — target user with status or flag `blocked`.
- `updated users representation` — user list or row data reflecting the `blocked` state.
- `access denied state` — observable inability of blocked user to use the application.

### Canonical values

- Role: `administrator`.
- User state: `blocked`.
- Error codes: `administrator-role-required`, `user-not-found`.
- UI action: `block_user`.

## Role-specific Interface Notes

### Frontend

- Frontend must bind the user action `block_user` to the `Block user` contract.
- Frontend must not implement `unblock_user` as part of `FEATURE-005`.
- Frontend must surface success, guard denial and not-found outcomes without inventing additional business states.

### Backend

- Backend must enforce `administrator-role-required` before updating target user state.
- Backend must return `user-not-found` when the target user does not exist.
- Backend must produce the side effect that a blocked user loses application access.

### DevOps

- DevOps has no mandatory runtime change from current sources.
- DevOps involvement is required only if architecture assigns a seed, fixture, test target or deployment adjustment for QA acceptance.

### E2E QA

- E2E QA must cover the administrator blocking flow.
- E2E QA must cover blocked-user access denial when the test target supports a second actor or test-mode user.
- E2E QA must record a resolver when required test actors or data paths are missing.

## Traceability

- Source contracts: [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- Source architecture docs: `n/a`
- Related behavior: [behavior.md](./behavior.md)
- Related UI behavior: [ui-behavior.md](./ui-behavior.md)
- Related test scenarios: [test-scenarios.md](./test-scenarios.md)

## Open Questions

- No fixed API route, HTTP method, persistence strategy or transport shape is defined by current system sources.
- Поведение повторной блокировки уже заблокированного пользователя не определено текущими canonical sources.
