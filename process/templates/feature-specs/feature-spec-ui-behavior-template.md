# Шаблон ui-behavior.md feature package

## Назначение

Документ фиксирует UI behavior slice decomposed feature package для одной `FEATURE-*`.

`ui-behavior.md` содержит только системно значимое UI-поведение: screen/surface mapping, user actions, visibility, disabled/hidden/guarded states, confirmation, notification, inline errors, design readiness и versioned `.references` links.

Документ не описывает визуальные токены, цвета, типографику, отступы или декоративные решения, если они не являются системно значимым поведением.

## Карточка документа

- Feature: `<FEATURE-001>`
- Package root: `<docs/system/feature-specs/feature-001-slug/>`
- Index: `<./index.md>`
- UI scope status: `<applicable | n/a>`
- Status: `<draft | ready-for-architecture | updated-after-analysis>`
- Last consistency check: `<YYYY-MM-DD | pending>`

## Non-UI Feature Marker

Используется только если `UI scope status: n/a`.

- Reason: `<почему UI behavior slice не применим к feature>`
- Required UI verification: `n/a`
- Versioned design sources: `n/a`

## UI Sources

- `ui-contract`: `<docs/system/ui-contracts/... | n/a>`
- `ui-behavior-mapping`: `<docs/system/ui-behavior-mapping/... | n/a>`
- `versioned design sources`: `<.references/... | n/a>`
- `prototype verification status`: `<pending | verified | blocked | n/a>`
- `design correction tasks`: `<DESIGN-001 | n/a>`

## System-relevant UI States

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

## UI Element Action Sequence

### Screen or surface

- `<screen / surface name>`

### Element-to-action mapping

| UI element  | User action | System reaction                     | Related behavior or interface        | Source     |
| ----------- | ----------- | ----------------------------------- | ------------------------------------ | ---------- |
| `<element>` | `<action>`  | `Система должна <реакция системы>.` | `<./behavior.md or ./interfaces.md>` | `<source>` |

### Interaction notes

- `Система должна <правило видимости, доступности, подтверждения, блокировки или уведомления>.`

## Design Readiness Audit

### Current prototype status

- `<complete | partial | missing | blocked | n/a>`

### Audit checklist

- `<screen / state / interaction / data gap>`
- `<screen / state / interaction / data gap>`

### Design gaps and required prototype corrections

- Gap: `<gap description | n/a>`
  - Required correction: `<correction description | n/a>`
  - Designer brief task: `<DESIGN-001 | n/a>`
  - Canonical source: `<.references/... or n/a>`

### Repeated verification result

- `<verified against updated Git-tracked prototype | pending | blocked | n/a>`

### Design handoff rule

- `ready-for-architecture` requires `prototype verification status: verified` or `UI scope status: n/a`.
- Blocking design gaps require a self-contained `DESIGN-*` task before architecture handoff.
- `DESIGN-*` task content must be limited to what to add, change, remove, verify, and which named approved UI source to update.

## Role-specific UI Notes

### Frontend

- `<what frontend must know from this UI behavior slice>`

### Manual QA

- `<what manual QA must inspect or verify>`

### E2E QA

- `<what e2e QA must assert if UI behavior is browser-testable>`

## Traceability

- Related behavior: `<./behavior.md#... | n/a>`
- Related interfaces: `<./interfaces.md#... | n/a>`
- Related test scenarios: `<./test-scenarios.md#... | n/a>`
- Source UI mapping: `<docs/system/ui-behavior-mapping/... | n/a>`
- Source design files: `<.references/... | n/a>`

## Open Questions

- `<open question | Нет>`
