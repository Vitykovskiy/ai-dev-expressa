# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- Подзадача: `02 — Task handoff normalization`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `task cards and architecture handoff links for FEATURE-002`
- Связанный план: `FEATURE-002-execution-plan.md`

## Цель подзадачи

Синхронизировать архивные дочерние карточки и handoff sections архитектурных карт `FEATURE-002` с новым workflow: feature spec и sibling test scenarios являются первым маршрутом чтения.

## Поведенческий промпт исполнителя

```text
You operate as Architect.

Complete only the Task handoff normalization subtask within the source task FEATURE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `FEATURE-002-execution-plan.md`
- `FEATURE-002-context-01-feature-package.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `tasks/archive/QA-002-administrator-menu-catalog-management.md`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/qa-menu-catalog.md`

## Ключевые факты из источников

- Новый workflow требует, чтобы каждая `FEATURE-*` перед архитектурной передачей ссылалась на готовый feature spec и sibling test scenarios document.
- `AR-*`, `FE-*`, `BE-*`, manual `QA-*` и e2e `QA-*` должны читать feature spec и test scenarios как canonical acceptance route.
- `DO-003` является historical/deprecated baseline и не закрывает `QA-005`; это нужно сохранить без расширения acceptance path.
- Карты frontend/backend/QA уже содержат handoff route for `FEATURE-002`, но их нужно привести к new workflow source order.

## Разрешенная зона правок

- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `tasks/archive/QA-002-administrator-menu-catalog-management.md`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/qa-menu-catalog.md`

## Запрещенная зона правок

- `.references/`
- `backend/`
- `frontend/`
- `e2e/`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`

## Входы и зависимости

- Выполнена подзадача `01`.
- Подзадача `03` зависит от актуальных QA handoff links и coverage expectations.

## Ожидаемый результат

Карточки и архитектурные карты `FEATURE-002` явно используют feature spec и sibling test scenarios как canonical read set; implementation и QA handoff не восстанавливают acceptance из production-кода или разрозненных старых карточек.

## Проверки

- `rg -n "feature-002-administrator-menu-catalog-management" tasks/archive docs/architecture/application-map`
- `rg -n "test-scenarios" tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md tasks/archive/BE-002-administrator-menu-catalog-backend.md tasks/archive/FE-002-administrator-menu-catalog-ui.md tasks/archive/QA-002-administrator-menu-catalog-management.md tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md docs/architecture/application-map`
- Ручная проверка, что `DO-003` остался historical/deprecated и не стал acceptance path.

## Критерии готовности

- Дочерние карточки `AR-003`, `BE-002`, `FE-002`, `QA-002`, `QA-005` включают feature spec и test scenarios в системные артефакты или минимальный read set по смыслу роли.
- Архитектурные handoff sections `FEATURE-002` сначала указывают feature spec и test scenarios.
- `DO-003` сохраняет DevOps historical baseline и ссылается на feature package только как на источник контекста, если ссылка добавлена.

## Риски и запреты

- Не менять статусы выполненных архивных задач без необходимости.
- Не добавлять новые executable work items вне `FEATURE-002`.
- Не менять production-код или тесты в этой подзадаче.

## Открытые вопросы

- Нет.
