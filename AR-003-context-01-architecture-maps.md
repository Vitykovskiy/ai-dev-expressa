# Контекст подзадачи 01: архитектурные карты FEATURE-002

## Карточка контекста

- Исходная задача: `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- Подзадача: `01 — Проверить архитектурные карты FEATURE-002`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `docs/architecture/` для карт и стандартов, связанных с FEATURE-002 menu catalog handoff`
- Связанный план: `AR-003-execution-plan.md`

## Цель подзадачи

Проверить, что архитектурные карты и профильные стандарты содержат достаточный handoff для клиентской части, серверной части и QA управления каталогом меню.

## Поведенческий промпт исполнителя

```text
You operate as a strict architect.

Complete only subtask 01 from AR-003-execution-plan.md.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `process/prompts/architect/prompt.md`
- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/README.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `AR-003-execution-plan.md`

## Ключевые факты из источников

- `AR-003` требует handoff для вкладки `Меню`, backend boundary каталога меню и QA-проверок.
- `backend-menu-catalog.md` должен фиксировать `/backoffice/menu/*`, DTO snapshot, capability `menu`, `invalid-drink-size-model` и `invalid-option-group-rule`.
- `frontend-backoffice.md` должен фиксировать route `/menu`, связь с React-референсом и запрет на восстановление backend rules из UI-кода.
- `qa-menu-catalog.md` должен фиксировать manual, integration и e2e acceptance для FEATURE-002, включая локальный containerized route `npm run test:e2e:local`.

## Разрешенная зона правок

- `docs/architecture/README.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `AR-003-execution-plan.md`

## Запрещенная зона правок

- `backend/`
- `frontend/`
- `e2e/`
- `.references/`
- `tasks/`
- `docs/business/`
- `docs/system/`

## Входы и зависимости

- Эта подзадача не зависит от других подзадач плана.
- Подзадачи `02`, `03`, `04` используют результат этой проверки.

## Ожидаемый результат

Архитектурные карты FEATURE-002 согласованы между собой и дают FE/BE/QA исполнителям самодостаточные границы без чтения production-кода соседних контуров.

## Проверки

- `rg "FEATURE-002|/backoffice/menu|invalid-drink-size-model|invalid-option-group-rule|test:e2e:local" docs/architecture`
- Ручная сверка read set из этой карточки с `AR-003`.

## Критерии готовности

- Карты содержат route, endpoint, DTO, guard, error и QA acceptance boundaries для FEATURE-002.
- В плане `AR-003-execution-plan.md` подзадача `01` отмечена как `Выполнена`.
- Сделан отдельный коммит только с изменениями этой подзадачи.

## Риски и запреты

- Риск: случайно расширить FEATURE-002 на оперативную доступность barista или клиентский заказ.
- Запрещено менять production-код и `.references/`.

## Открытые вопросы

- Нет.
