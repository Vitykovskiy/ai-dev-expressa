# Инструкция по формированию feature package

## Назначение

Инструкция описывает, как системный аналитик формирует decomposed feature package для одной `FEATURE-*`.

Feature package оптимизирует контекст, передаваемый агентам. Он заменяет монолитный feature spec набором специализированных slices, чтобы каждая роль читала только релевантный системный handoff.

## Каноническая структура

`FEATURE-*` используют folder package format:

```text
docs/system/feature-specs/<feature-id>-<slug>/
|-- index.md
|-- behavior.md
|-- interfaces.md
|-- ui-behavior.md
|-- test-scenarios.md
```

- `index.md` создается по `process/templates/feature-specs/feature-spec-template.md`.
- `behavior.md` создается по `process/templates/feature-specs/feature-spec-behavior-template.md`.
- `interfaces.md` создается по `process/templates/feature-specs/feature-spec-interfaces-template.md`.
- `ui-behavior.md` создается по `process/templates/feature-specs/feature-spec-ui-behavior-template.md`.
- `test-scenarios.md` создается по `process/templates/feature-specs/feature-test-scenarios-template.md`.

## Порядок формирования

1. Системный аналитик читает task-card, business input, approved UI contracts и relevant system sources из назначенного маршрута чтения.
2. Системный аналитик извлекает feature-specific facts из canonical sources до записи package slices.
3. Системный аналитик определяет границу фичи и создает `index.md`.
4. Системный аналитик переносит сценарии, сущности, инварианты, validations, errors и edge cases в `behavior.md`.
5. Системный аналитик переносит operation boundaries, inputs, outputs, guards, error mapping, test-mode и runtime constraints в `interfaces.md`.
6. Системный аналитик переносит screen/surface mapping, UI states, visibility, disabled/hidden/guarded states, design readiness, required `DESIGN-*` correction status и `.references` links в `ui-behavior.md`.
7. Системный аналитик переносит QA scenarios, stable Scenario IDs, manual route, e2e expectation, required assertions и coverage mapping в `test-scenarios.md`.
8. Системный аналитик возвращается в `index.md` и фиксирует role read routes для архитектора, Frontend, Backend, DevOps, Manual QA и E2E QA.
9. Системный аналитик обновляет `docs/system/README.md`, если package создан, переименован или materially changed.

## Правила декомпозиции

- Один feature package покрывает одну `FEATURE-*`.
- Каждый slice содержит только свой тип контекста.
- Один факт фиксируется в одном slice и связывается из других slices ссылкой.
- `index.md` не дублирует содержание slices; он маршрутизирует чтение.
- `behavior.md` не описывает API wire shape, runtime path или визуальные детали.
- `interfaces.md` не пересказывает workflows, кроме ссылок на поведенческий источник.
- `ui-behavior.md` не описывает визуальную композицию, если она не влияет на системное поведение.
- `ui-behavior.md` фиксирует design-readiness результат, а не заменяет дизайнерский brief или визуальную спецификацию.
- `test-scenarios.md` не меняет ожидаемое поведение; он проверяет поведение, закрепленное в package.
- Для non-UI feature `ui-behavior.md` остается коротким slice со статусом `n/a` и причиной.

## Design readiness и `DESIGN-*`

- UI feature получает architecture handoff только после `prototype verification status: verified`; non-UI feature использует явный `n/a`.
- Явный blocker/open question удерживает feature package вне статуса `ready-for-architecture`.
- Если approved UI source не покрывает required user action, state, guard, validation, error или operation entrypoint, системный аналитик фиксирует design gap в `ui-behavior.md`.
- Если design gap требует дизайнерского изменения, системный аналитик создает self-contained `DESIGN-*` task.
- `DESIGN-*` task содержит только brief для дизайнера: что добавить, что изменить, что убрать, какие состояния проверить и какой named approved UI source обновить.
- Feature package с открытым blocking `DESIGN-*` не получает статус `ready-for-architecture`.
- После выполнения `DESIGN-*` системный аналитик повторно проверяет approved UI source и обновляет `ui-behavior.md`, `index.md` и role read routes при необходимости.

## Role read routes

`index.md` должен задавать role read routes:

- Архитектор читает `index.md`, все feature-relevant slices и точечные architecture docs.
- Frontend читает `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`, профильную frontend architecture и нужные `.references`.
- Backend читает `index.md`, `behavior.md`, `interfaces.md`, профильную backend architecture и точечные contracts.
- DevOps читает `index.md`, `interfaces.md`, runtime/delivery architecture и `test-scenarios.md`, если feature меняет acceptance path.
- Manual QA читает `index.md`, `behavior.md`, `ui-behavior.md`, `test-scenarios.md` и QA standards.
- E2E QA читает `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`, `test-scenarios.md`, QA/devops/application-map docs.

## Supporting sources

- Supporting docs в `docs/system/contracts`, `docs/system/use-cases`, `docs/system/domain-model`, `docs/system/state-models`, `docs/system/ui-behavior-mapping` остаются sources for analysis.
- Supporting source включается в role read route только если package slice не может безопасно заменить его для конкретной роли.
- Supporting source не включается в каждый исполнительный read set автоматически.
- `.references` включаются только как конкретные versioned files для UI/design verification.
- Business docs включаются в developer-facing route только если системный package явно фиксирует missing system source.

## Нормализация требований

- Поведенческие требования формулируются в позитивной форме: `Система должна ...`.
- Scope constraints фиксируют ограничения области выполнения.
- Safety constraints фиксируют инварианты безопасности.
- Одно ограничение фиксируется одним атомарным утверждением.
- Запреты не переписываются в псевдопозитивные формулировки без прироста семантики.
- Один и тот же смысл не дублируется в разных slices.
- Удаление инструкции допустимо только при доказанной редундантности.
- Каждый пункт package должен добавлять проверяемую семантику.

## Критерии готовности

- Package содержит все пять slices.
- `index.md` содержит role read routes.
- `behavior.md` покрывает workflows, validations, errors, edge cases, scope constraints и safety constraints.
- `interfaces.md` покрывает operation boundaries, inputs, outputs, guards, error mapping, test-mode и runtime constraints.
- `ui-behavior.md` покрывает UI behavior или явно фиксирует `n/a`.
- Blocking `DESIGN-*` tasks закрыты или design scope явно фиксирует `n/a`.
- `test-scenarios.md` покрывает stable Scenario IDs, manual route, e2e expectation, required assertions и coverage mapping.
- Следующая роль может получить короткий read set из package slices без чтения широкого `docs/system/`.
- Открытые gaps, contradictions и blockers зафиксированы явно.
