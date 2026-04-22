# Шаблон feature spec

## Назначение

Документ фиксирует канонический feature spec для одной `FEATURE-*`.

Документ используется как:

- основной маршрут чтения для архитектурной декомпозиции;
- источник traceability между бизнес-входом, системными артефактами и UI-поведением;
- основание для handoff архитектору, frontend, backend, QA и другим ролям.

## Размещение

- Канонический путь: `docs/system/feature-specs/<feature-id>-<slug>.md`.
- Документ размещается рядом с документом сценариев тестирования той же фичи.
- Документ создается до передачи `FEATURE-*` архитектору.
- Документ входит в `Системные артефакты` и `Минимальный read set` карточек `FEATURE-*`, `AR-*`, manual `QA-*` и e2e `QA-*`.

## Владение

- Системный аналитик создает и обновляет feature spec на основании canonical sources.
- Архитектор использует feature spec как первый маршрут чтения для декомпозиции фичи.
- Manual QA и e2e QA используют feature spec вместе с sibling test scenarios document как общий источник проверки.

## Карточка документа

- Feature: `<FEATURE-001>`
- Parent sprint: `<SPRINT-001 | n/a>`
- Feature spec: `<docs/system/feature-specs/feature-001-slug.md>`
- Test scenarios: `<docs/system/feature-specs/feature-001-slug.test-scenarios.md>`
- Status: `<draft | ready-for-architecture | updated-after-analysis>`
- Related roles: `<Системный аналитик | Архитектор | Frontend | Backend | QA | DevOps | n/a>`
- Affected interfaces: `<список интерфейсов, экранов, API, системных границ или n/a>`
- Last consistency check: `<YYYY-MM-DD | pending>`

## Source Trace

### Business input

- `<docs/business/...>`
- `<task-card / sprint-card / other approved source>`

### System sources

- `use-cases`: `<docs/system/use-cases/...>`
- `contracts`: `<docs/system/contracts/...>`
- `domain-model`: `<docs/system/domain-model/...>`
- `state-models`: `<docs/system/state-models/...>`
- `ui-behavior-mapping`: `<docs/system/ui-behavior-mapping/... | n/a>`

### UI sources

- `ui-contract`: `<docs/system/ui-contracts/... | n/a>`
- `versioned design sources`: `<.references/... | n/a>`
- `prototype verification status`: `<pending | verified | blocked>`

## Feature Boundary

### Included scope

- `<описание включенной части фичи>`

### Explicitly excluded scope

- `<описание исключенной части фичи>`

### Business outcome

- `Система должна <наблюдаемое и проверяемое системное поведение, которое завершает фичу>.`

### Dependencies

- `<зависимые use cases, contracts, domain slices, state models, UI mappings, design sources, task cards>`

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

### System-relevant UI states

- Empty state: `Система должна <поведение пустого состояния>.`
- Loading state: `Система должна <поведение состояния загрузки>.`
- Success state: `Система должна <поведение успешного состояния>.`
- Error state: `Система должна <поведение ошибки>.`
- Disabled state: `Система должна <поведение отключенного элемента или сценария>.`
- Hidden state: `Система должна <поведение скрытого элемента или сценария>.`
- Guarded state: `Система должна <поведение при role/capability guard>.`
- Confirmation state: `Система должна <поведение подтверждения действия>.`
- Notification state: `Система должна <поведение уведомления или тоста>.`
- Inline error state: `Система должна <поведение встроенной ошибки формы или поля>.`

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

## UI Element Action Sequence

### Screen or surface

- `<screen / surface name>`

### Element-to-action mapping

| UI element  | User action | System reaction                     | Related source                                      |
| ----------- | ----------- | ----------------------------------- | --------------------------------------------------- |
| `<element>` | `<action>`  | `Система должна <реакция системы>.` | `<feature spec / ui contract / mapping / contract>` |

### Interaction notes

- `Система должна <правило видимости, доступности, подтверждения, блокировки или уведомления>.`

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

## Prototype Completeness Audit

### Current prototype status

- `<complete | partial | missing | blocked>`

### Audit checklist

- `<screen / state / interaction / data gap>`
- `<screen / state / interaction / data gap>`

### Design gaps and required prototype corrections

- Gap: `<gap description>`
  - Required correction: `<correction description>`
  - Canonical source: `<.references/... or n/a>`

### Repeated verification result

- `<verified against updated Git-tracked prototype | pending | blocked>`

## Blockers

- `<blocker>`

## Test Scenarios Link

- `Система должна ссылаться на sibling документ сценариев тестирования фичи: <docs/system/feature-specs/feature-001-slug.test-scenarios.md>.`
- `<additional linkage or note>`

## Architecture Handoff Checklist

- `Система должна иметь явную feature boundary.`
- `Система должна иметь перечисленные user workflows.`
- `Система должна иметь UI interaction requirements для релевантных экранов или surface-ов.`
- `Система должна иметь input constraints, validations, errors и edge cases.`
- `Система должна иметь explicit Scope Constraints и Safety Constraints.`
- `Система должна иметь audit design readiness и documented prototype completeness status.`
- `Система должна иметь sibling test scenarios document со stable scenario IDs и coverage mapping.`
- `Система должна иметь ссылки на canonical system sources и versioned design sources, если UI scope применим.`
- `Система должна быть готова к архитектурной декомпозиции без обращения к production code.`
