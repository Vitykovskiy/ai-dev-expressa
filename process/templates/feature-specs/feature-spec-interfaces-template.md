# Шаблон interfaces.md feature package

## Назначение

Документ фиксирует interface slice decomposed feature package для одной `FEATURE-*`.

`interfaces.md` содержит feature-specific контракты взаимодействий, operation boundaries, inputs, outputs, guards, errors, test-mode и runtime constraints, нужные frontend, backend, DevOps, архитектору и e2e QA.

## Карточка документа

- Feature: `<FEATURE-001>`
- Package root: `<docs/system/feature-specs/feature-001-slug/>`
- Index: `<./index.md>`
- Status: `<draft | ready-for-architecture | updated-after-analysis>`
- Last consistency check: `<YYYY-MM-DD | pending>`

## Interface Boundary

### Affected interfaces

- `<screen / API / route / external integration / runtime boundary>`

### Non-affected interfaces

- `<interface explicitly outside this feature | n/a>`

### Consumers and providers

| Consumer     | Provider     | Interaction                          | Source     |
| ------------ | ------------ | ------------------------------------ | ---------- |
| `<consumer>` | `<provider>` | `<operation or interaction purpose>` | `<source>` |

## Operations

### `<operation name>`

- Purpose: `<why this operation exists in the feature>`
- Consumer: `<frontend | backend | devops | external actor | n/a>`
- Provider: `<backend | frontend | external system | runtime | n/a>`
- Trigger: `<user action or system condition>`
- Inputs: `<fields, headers, route params, env vars or n/a>`
- Outputs: `<response, state change, UI result, side effect or n/a>`
- Guards: `<role/capability/environment/test-mode guard or n/a>`
- Side effects: `<state changes, emitted events, notifications or n/a>`
- Source: `<docs/system/contracts/... | docs/architecture/... | n/a>`

### Validation and error mapping

| Operation     | Condition     | System behavior                         | User-visible outcome | Source |
| ------------- | ------------- | --------------------------------------- | -------------------- | ------ | ---------- |
| `<operation>` | `<condition>` | `Система должна <system-level result>.` | `<outcome            | n/a>`  | `<source>` |

## Test-mode and Runtime Constraints

- `<test-mode input, environment flag, seed/precondition, deployment or runtime constraint>`
- `Система должна <runtime/test-mode behavior>.`

## Data Contract Summary

### Inputs

- `<input name>` — `<meaning, type/format if fixed by system source, required/optional>`

### Outputs

- `<output name>` — `<meaning, type/format if fixed by system source, required/optional>`

### Canonical values

- `<role | capability | status | error code | route name>`

## Role-specific Interface Notes

### Frontend

- `<what frontend must know from this interface slice>`

### Backend

- `<what backend must know from this interface slice>`

### DevOps

- `<what DevOps must know from this interface slice | n/a>`

### E2E QA

- `<what e2e QA must assert or prepare from this interface slice>`

## Traceability

- Source contracts: `<docs/system/contracts/... | n/a>`
- Source architecture docs: `<docs/architecture/... | n/a>`
- Related behavior: `<./behavior.md#... | n/a>`
- Related UI behavior: `<./ui-behavior.md#... | n/a>`
- Related test scenarios: `<./test-scenarios.md#... | n/a>`

## Open Questions

- `<open question | Нет>`
