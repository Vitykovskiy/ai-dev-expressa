# Контекст подзадачи 02: дочерние FE/BE задачи FEATURE-002

## Карточка контекста

- Исходная задача: `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- Подзадача: `02 — Проверить дочерние FE/BE задачи FEATURE-002`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `tasks/archive/FE-002-administrator-menu-catalog-ui.md`, `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- Связанный план: `AR-003-execution-plan.md`

## Цель подзадачи

Проверить, что `FE-002` и `BE-002` передают реализацию управления каталогом меню через системные контракты и профильные карты, без необходимости читать production-код соседнего контура.

## Поведенческий промпт исполнителя

```text
You operate as a strict architect.

Complete only subtask 02 from AR-003-execution-plan.md.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `process/prompts/architect/prompt.md`
- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/stack.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `AR-003-execution-plan.md`

## Ключевые факты из источников

- `FE-002` должен использовать `/menu`, capability-driven session, `menu-and-availability-management.md` и React-референсы как UI ориентир.
- `BE-002` должен использовать backoffice guard, `/backoffice/menu/*`, доменные проверки каталога и contract-facing DTO.
- Обе задачи должны ссылаться на `FEATURE-002`, `AR-003`, профильные архитектурные стандарты и контурные карты.

## Разрешенная зона правок

- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
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

- Зависит от подзадачи `01`.
- Подзадачи `03` и `04` используют результат этой проверки.

## Ожидаемый результат

`FE-002` и `BE-002` содержат корректные документы, минимальный read set, проверки, критерии готовности и результат выполнения, достаточные для review handoff.

## Проверки

- `rg "docs/system/contracts/menu-and-availability-management|docs/architecture/application-map/backend-menu-catalog|docs/architecture/application-map/frontend-backoffice|invalid-drink-size-model|invalid-option-group-rule|capability" tasks/archive/FE-002-administrator-menu-catalog-ui.md tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- Ручная сверка, что task-card не требует `docs/business/*`.

## Критерии готовности

- `FE-002` и `BE-002` не требуют чтения production-кода соседнего контура для восстановления API shape, auth semantics, guards или errors.
- В плане `AR-003-execution-plan.md` подзадача `02` отмечена как `Выполнена`.
- Сделан отдельный коммит только с изменениями этой подзадачи.

## Риски и запреты

- Риск: заменить архитектурный handoff описанием уже реализованного production-кода.
- Запрещено менять production-код и системные требования.

## Открытые вопросы

- Нет.
