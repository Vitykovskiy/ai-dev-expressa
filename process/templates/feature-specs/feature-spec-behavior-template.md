# Шаблон behavior.md feature package

## Назначение

Документ фиксирует поведенческий slice decomposed feature package для одной `FEATURE-*`.

`behavior.md` содержит feature-specific системное поведение, которое требуется архитектору, frontend, backend и QA без чтения широкого набора supporting docs.

## Карточка документа

- Feature: `<FEATURE-001>`
- Package root: `<docs/system/feature-specs/feature-001-slug/>`
- Index: `<./index.md>`
- Status: `<draft | ready-for-architecture | updated-after-analysis>`
- Last consistency check: `<YYYY-MM-DD | pending>`

## User Workflows

### Main workflow

1. `<trigger or user action>`
2. `Система должна <реакция системы>.`
3. `Система должна <результат или переход состояния>.`

### Alternative workflows

#### `<alternative workflow name>`

1. `<trigger or user action>`
2. `Система должна <реакция системы>.`
3. `Система должна <результат или переход состояния>.`

### Exception workflows

#### `<exception workflow name>`

1. `<trigger or system condition>`
2. `Система должна <реакция системы>.`
3. `Система должна <наблюдаемое состояние после ошибки или ограничения>.`

## Entity View

### Entities

- `<сущность 1>`
- `<сущность 2>`

### Relations

- `<связь между сущностями>`

### Invariants

- `Система должна <инвариант сущности или связи>.`

### Identity and ownership

- `<идентификатор, владелец жизненного цикла, источник истины>`

## Input Constraints

### Required inputs

- `<required field or input>`

### Allowed values

- `<allowed value set or format>`

### Cross-field constraints

- `Система должна <ограничение на совместимость полей или значений>.`

### Boundary values

- `<min / max / empty / trimmed / duplicate / limit case>`

## Validations

### Field validations

- `Система должна <валидация поля>.`

### Business validations

- `Система должна <валидация бизнес-правила>.`

### Role or capability validations

- `Система должна <валидация роли, capability или guard>.`

## Errors

### User-facing errors

- `<error code or scenario>` — `Система должна <наблюдаемое сообщение или поведение>.`

### System errors

- `<error condition>` — `Система должна <реакция системы>.`

### Error mapping

| Condition     | User-visible outcome                      | Source     |
| ------------- | ----------------------------------------- | ---------- |
| `<condition>` | `Система должна <наблюдаемое поведение>.` | `<source>` |

## Edge Cases

- `Система должна <поведение для граничного случая>.`
- `Система должна <поведение для конкурентного или редкого сценария>.`
- `Система должна <поведение для повторного действия, дубликата или восстановления>.`

## Scope Constraints

- `<atomic scope constraint 1>`
- `<atomic scope constraint 2>`
- `<atomic scope constraint 3>`

## Safety Constraints

- `<atomic safety invariant 1>`
- `<atomic safety invariant 2>`
- `<atomic safety invariant 3>`

## Traceability

- Source use cases: `<docs/system/use-cases/... | n/a>`
- Source domain model: `<docs/system/domain-model/... | n/a>`
- Source state models: `<docs/system/state-models/... | n/a>`
- Source contracts: `<docs/system/contracts/... | n/a>`
- Related test scenarios: `<./test-scenarios.md#... | n/a>`

## Open Questions

- `<open question | Нет>`
