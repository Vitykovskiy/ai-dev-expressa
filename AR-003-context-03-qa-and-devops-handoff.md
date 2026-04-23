# Контекст подзадачи 03: QA и DevOps handoff FEATURE-002

## Карточка контекста

- Исходная задача: `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- Подзадача: `03 — Проверить QA и DevOps handoff FEATURE-002`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `tasks/archive/QA-002-administrator-menu-catalog-management.md`, `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`, `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- Связанный план: `AR-003-execution-plan.md`

## Цель подзадачи

Проверить, что manual QA, e2e QA и historical DevOps baseline не смешивают ответственность и фиксируют актуальный route закрытия FEATURE-002.

## Поведенческий промпт исполнителя

```text
You operate as a strict architect.

Complete only subtask 03 from AR-003-execution-plan.md.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `process/prompts/architect/prompt.md`
- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `tasks/archive/QA-002-administrator-menu-catalog-management.md`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/backend-access.md`
- `AR-003-execution-plan.md`

## Ключевые факты из источников

- `QA-002` закрывает ручной проход, UI parity и defect triage.
- `QA-005` закрывает browser e2e lane и coverage mapping по stable Scenario IDs.
- `DO-003` является historical/deprecated VPS baseline и не закрывает acceptance path `QA-005`.
- `qa-standards.md` требует две QA-задачи для feature: manual lane и e2e lane.

## Разрешенная зона правок

- `tasks/archive/QA-002-administrator-menu-catalog-management.md`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- `AR-003-execution-plan.md`

## Запрещенная зона правок

- `backend/`
- `frontend/`
- `e2e/`
- `.references/`
- `docs/business/`
- `docs/system/`
- `docs/architecture/`
- другие task-card файлы

## Входы и зависимости

- Зависит от подзадач `01` и `02`.
- Подзадача `04` использует результат этой проверки.

## Ожидаемый результат

QA/DevOps handoff FEATURE-002 явно разделяет manual QA, e2e QA и historical DevOps runner; финальный e2e acceptance остается локальным containerized route.

## Проверки

- `rg "test:e2e:local|historical|deprecated|Scenario IDs|manual QA|e2e" tasks/archive/QA-002-administrator-menu-catalog-management.md tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- Ручная сверка, что `DO-003` не объявляет себя acceptance path для `QA-005`.

## Критерии готовности

- `QA-002`, `QA-005` и `DO-003` имеют непротиворечивые зависимости, проверки и критерии готовности.
- В плане `AR-003-execution-plan.md` подзадача `03` отмечена как `Выполнена`.
- Сделан отдельный коммит только с изменениями этой подзадачи.

## Риски и запреты

- Риск: смешать DevOps preflight с QA-owned browser scenarios.
- Запрещено менять e2e-тесты, runner scripts и runtime configuration.

## Открытые вопросы

- Нет.
