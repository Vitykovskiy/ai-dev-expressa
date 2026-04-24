# Шаблон index.md feature package

## Назначение

Документ фиксирует входной slice decomposed feature package для одной `FEATURE-*`.

Feature package является основным источником системного handoff-контекста для агентов. Supporting system docs остаются canonical sources для анализа, но исполнительные роли читают только назначенные package slices и точечные supporting sources из role read routes.

## Размещение

- Канонический путь package: `docs/system/feature-specs/<feature-id>-<slug>/`.
- Канонический путь index slice: `docs/system/feature-specs/<feature-id>-<slug>/index.md`.
- Package создается до передачи `FEATURE-*` архитектору.
- Новые `FEATURE-*` создаются только в folder package format.
- Flat feature spec файлы остаются legacy package до ближайшего системно-аналитического обновления соответствующей фичи.

## Package slices

```text
docs/system/feature-specs/<feature-id>-<slug>/
|-- index.md
|-- behavior.md
|-- interfaces.md
|-- ui-behavior.md
|-- test-scenarios.md
```

- `index.md` — feature boundary, source trace, affected roles/interfaces, package navigation, role read routes.
- `behavior.md` — workflows, entity view, invariants, validations, errors, edge cases, scope/safety constraints.
- `interfaces.md` — frontend/backend/devops-relevant contracts, operations, inputs/outputs, guards, error mapping, test-mode/runtime constraints.
- `ui-behavior.md` — UI element action sequence, UI states, visibility, disabled/hidden/guarded states, `.references` links and design readiness.
- `test-scenarios.md` — stable scenario IDs, manual QA route, e2e coverage expectation, required assertions and coverage mapping.

## Владение

- Системный аналитик создает и обновляет feature package на основании canonical sources.
- Архитектор использует `index.md` как первый маршрут чтения и строит дочерние task read routes из role read routes.
- Frontend, Backend, DevOps и QA читают только назначенные им package slices, профильные architecture docs и точечные supporting sources.
- Manual QA и e2e QA используют `test-scenarios.md` как общий QA slice package.

## Карточка документа

- Feature: `<FEATURE-001>`
- Parent sprint: `<SPRINT-001 | n/a>`
- Package root: `<docs/system/feature-specs/feature-001-slug/>`
- Status: `<draft | ready-for-architecture | updated-after-analysis>`
- Related roles: `<Системный аналитик | Архитектор | Frontend | Backend | DevOps | QA | n/a>`
- Affected interfaces: `<список интерфейсов, экранов, API, системных границ или n/a>`
- Last consistency check: `<YYYY-MM-DD | pending>`

## Package Navigation

- Behavior: `<./behavior.md>`
- Interfaces: `<./interfaces.md>`
- UI behavior: `<./ui-behavior.md>`
- Test scenarios: `<./test-scenarios.md>`

## Source Trace

### Business input

- `<docs/business/...>`
- `<task-card / sprint-card / other approved source>`

### System sources

- `use-cases`: `<docs/system/use-cases/... | n/a>`
- `contracts`: `<docs/system/contracts/... | n/a>`
- `domain-model`: `<docs/system/domain-model/... | n/a>`
- `state-models`: `<docs/system/state-models/... | n/a>`
- `ui-behavior-mapping`: `<docs/system/ui-behavior-mapping/... | n/a>`

### UI sources

- `ui-contract`: `<docs/system/ui-contracts/... | n/a>`
- `versioned design sources`: `<.references/... | n/a>`
- `prototype verification status`: `<pending | verified | blocked | n/a>`

## Feature Boundary

### Included scope

- `Система должна <описание включенной части фичи>.`

### Explicitly excluded scope

- `<атомарное исключение из области фичи>`

### Business outcome

- `Система должна <наблюдаемое и проверяемое системное поведение, которое завершает фичу>.`

### Dependencies

- `<зависимые package slices, canonical sources, design sources, task cards или n/a>`

## Role Read Routes

### Архитектор

- `<./index.md>`
- `<./behavior.md>`
- `<./interfaces.md>`
- `<./ui-behavior.md | n/a>`
- `<./test-scenarios.md>`
- `<точечные architecture docs или supporting sources>`

### Frontend

- `<./index.md>`
- `<./behavior.md>`
- `<./interfaces.md>`
- `<./ui-behavior.md>`
- `<./test-scenarios.md | если нужны Scenario ID или acceptance mapping>`
- `<точечные frontend architecture docs и .references>`

### Backend

- `<./index.md>`
- `<./behavior.md>`
- `<./interfaces.md>`
- `<./test-scenarios.md | если нужны Scenario ID или acceptance mapping>`
- `<точечные backend architecture docs и supporting contracts>`

### DevOps

- `<./index.md>`
- `<./interfaces.md>`
- `<./test-scenarios.md | если feature меняет test/e2e/runtime acceptance>`
- `<точечные delivery/runtime architecture docs>`

### Manual QA

- `<./index.md>`
- `<./behavior.md>`
- `<./ui-behavior.md | n/a>`
- `<./test-scenarios.md>`
- `<точечные QA architecture docs и .references>`

### E2E QA

- `<./index.md>`
- `<./behavior.md>`
- `<./interfaces.md>`
- `<./ui-behavior.md | n/a>`
- `<./test-scenarios.md>`
- `<точечные QA/devops/application-map docs>`

## Supporting Sources Policy

- Supporting source включается в role read route только если роль не может выполнить задачу из package slices без потери точности.
- Один supporting source добавляется один раз и только в тот role read route, где он нужен.
- Package slice не дублирует supporting source целиком; slice фиксирует feature-specific вывод и дает ссылку на источник.
- Если необходимый факт отсутствует в package и supporting sources, системный аналитик фиксирует blocker или open question.

## Migration Status

- Package format: `<folder package | legacy flat package>`
- Legacy flat spec: `<path | n/a>`
- Legacy flat test scenarios: `<path | n/a>`
- Migration note: `<что перенесено или почему миграция отложена>`

## Blockers

- `<blocker | Нет>`

## Architecture Handoff Checklist

- `Система должна иметь готовые package slices: index, behavior, interfaces, ui-behavior и test-scenarios.`
- `Система должна иметь явную feature boundary.`
- `Система должна иметь role read routes для Архитектор, Frontend, Backend, DevOps, Manual QA и E2E QA.`
- `Система должна иметь перечисленные user workflows в behavior slice.`
- `Система должна иметь interaction, input, validation, error, guard и runtime boundaries в соответствующих package slices.`
- `Система должна иметь UI behavior и design readiness в ui-behavior slice или явный n/a для non-UI feature.`
- `Система должна иметь test-scenarios slice со stable scenario IDs и coverage mapping.`
- `Система должна быть готова к архитектурной декомпозиции без чтения широкого docs/system и без обращения к production code.`
