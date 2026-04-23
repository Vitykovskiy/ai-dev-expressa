# Контекст подзадачи 04: feature-level closure и навигация

## Карточка контекста

- Исходная задача: `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- Подзадача: `04 — Проверить feature-level closure и навигацию`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`, `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`, корневые файлы `AR-003-*`
- Связанный план: `AR-003-execution-plan.md`

## Цель подзадачи

Проверить финальную согласованность FEATURE-002 и AR-003 после выполнения подзадач: статус, декомпозиция, ссылки на документы, результат выполнения и корневые plan/context файлы.

## Поведенческий промпт исполнителя

```text
You operate as a strict architect.

Complete only subtask 04 from AR-003-execution-plan.md.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `process/prompts/architect/prompt.md`
- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- `tasks/archive/FE-002-administrator-menu-catalog-ui.md`
- `tasks/archive/BE-002-administrator-menu-catalog-backend.md`
- `tasks/archive/QA-002-administrator-menu-catalog-management.md`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
- `docs/architecture/README.md`
- `docs/architecture/application-map.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `AR-003-execution-plan.md`
- `AR-003-context-01-architecture-maps.md`
- `AR-003-context-02-child-task-handoff.md`
- `AR-003-context-03-qa-and-devops-handoff.md`
- `AR-003-context-04-final-feature-closure.md`

## Ключевые факты из источников

- `FEATURE-002` декомпозирована на `AR-003`, `BE-002`, `FE-002`, `DO-003`, `QA-002`, `QA-005`.
- `AR-003` уже содержит результат выполнения и перечисляет созданные или обновленные архитектурные карты.
- План `AR-003-execution-plan.md` является рабочим артефактом текущего запроса и должен показывать завершение всех подзадач.

## Разрешенная зона правок

- `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- `tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md`
- `AR-003-execution-plan.md`
- `AR-003-context-01-architecture-maps.md`
- `AR-003-context-02-child-task-handoff.md`
- `AR-003-context-03-qa-and-devops-handoff.md`
- `AR-003-context-04-final-feature-closure.md`

## Запрещенная зона правок

- `backend/`
- `frontend/`
- `e2e/`
- `.references/`
- `docs/business/`
- `docs/system/`
- `docs/architecture/`
- task-card файлы, не перечисленные в разрешенной зоне

## Входы и зависимости

- Зависит от подзадач `01`, `02`, `03`.
- После этой подзадачи весь план должен быть завершен.

## Ожидаемый результат

`FEATURE-002`, `AR-003` и корневые context-package файлы согласованы с фактическим завершенным handoff управления каталогом меню.

## Проверки

- `rg "Готова к работе|В работе" AR-003-execution-plan.md`
- `rg "FEATURE-002|AR-003|BE-002|FE-002|QA-002|QA-005|DO-003" tasks/archive/FEATURE-002-administrator-menu-catalog-management.md tasks/archive/AR-003-feature-002-menu-catalog-architecture-handoff.md AR-003-execution-plan.md`
- Ручная сверка, что все четыре подзадачи плана имеют статус `Выполнена`.

## Критерии готовности

- Все подзадачи в `AR-003-execution-plan.md` имеют статус `Выполнена`.
- `FEATURE-002` и `AR-003` не противоречат дочерним завершенным task-card.
- Сделан отдельный коммит только с изменениями этой подзадачи.

## Риски и запреты

- Риск: затронуть архивные карточки вне FEATURE-002.
- Запрещено менять реализацию и системные требования.

## Открытые вопросы

- Нет.
