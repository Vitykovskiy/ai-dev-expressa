# FEATURE-002 execution plan

## Источник

- Исходная карточка: `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- Цель: привести архивную `FEATURE-002` к состоянию, как если бы она проходила текущий `process/workflow.md` изначально.
- Ограничение: текущие незакоммиченные изменения в `.references/Expressa_admin` относятся к дизайну и не входят в зону правок этого плана.

## Подзадачи

### 01. Feature package

- Статус: `Выполнена`
- Контекст: `FEATURE-002-context-01-feature-package.md`
- Роль: `Системный аналитик`
- Задача: создать канонический feature spec и sibling-документ сценариев тестирования для `FEATURE-002`.
- Разрешенная зона правок:
  - `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
  - `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
  - `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- Ожидаемый результат: `FEATURE-002` имеет готовый feature package с явной границей, workflows, constraints, validations, errors, design readiness, stable Scenario IDs и coverage mapping.

### 02. Task handoff normalization

- Статус: `Ожидает 01`
- Контекст: `FEATURE-002-context-02-task-handoff-normalization.md`
- Роль: `Архитектор`
- Задача: синхронизировать карточки дочерних задач `FEATURE-002` с новым маршрутом чтения через feature spec и test scenarios.
- Разрешенная зона правок:
  - `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
  - `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
  - `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
  - `tasks/archive/QA-002-administrator-menu-catalog-management.md`
  - `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
  - `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
  - `docs/architecture/application-map/backend-menu-catalog.md`
  - `docs/architecture/application-map/frontend-backoffice.md`
  - `docs/architecture/application-map/qa-menu-catalog.md`
- Ожидаемый результат: все handoff/read-set места `FEATURE-002` сначала ведут через feature spec и sibling test scenarios, а архитектурные карты не требуют восстанавливать acceptance из production-кода.

### 03. Scenario ID coverage alignment

- Статус: `Ожидает 02`
- Контекст: `FEATURE-002-context-03-scenario-id-coverage.md`
- Роль: `Тестирование`
- Задача: привязать существующие e2e и backend integration checks `FEATURE-002` к stable Scenario IDs из нового test scenarios document.
- Разрешенная зона правок:
  - `e2e/menu-catalog/admin-menu-catalog.spec.ts`
  - `backend/test/menu-catalog.integration.spec.ts`
  - `backend/test/menu-catalog-domain.spec.ts`
  - `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
  - `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- Ожидаемый результат: automated coverage mapping содержит реальные test file и test title/ID, а тестовые названия или annotations содержат стабильные Scenario IDs.

## Порядок выполнения

1. Передать подзадачу `01` субагенту.
2. После завершения передать этому субагенту команду: `Сделай коммит, после отметь подзадачу выполненной`.
3. Передать подзадачу `02` следующему субагенту.
4. После завершения передать этому субагенту команду: `Сделай коммит, после отметь подзадачу выполненной`.
5. Передать подзадачу `03` следующему субагенту.
6. После завершения передать этому субагенту команду: `Сделай коммит, после отметь подзадачу выполненной`.

## Общие проверки

- `git status --short`
- Для documentation-only подзадач: ручная проверка ссылок и отсутствия противоречий с `process/workflow.md`.
- Для подзадачи `03`: минимум `npm run test:backend -- --run menu-catalog` или явная фиксация причины, если команда недоступна; e2e full run допускается не выполнять, если изменения ограничены названиями/annotations и mapping.
