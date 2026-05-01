# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/FEATURE-004-administrator-user-role-management.md`
- Подзадача: `04 — package index, navigation and task card`
- Роль исполнителя: `Системный аналитик`
- Контурная карта: `n/a`
- Зона ответственности: `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `docs/system/README.md`, `tasks/FEATURE-004-administrator-user-role-management.md`
- Связанный план: `.agent-work/FEATURE-004/execution-plan.md`

## Цель подзадачи

Создать package index, обновить системную навигацию и карточку FEATURE-004 так, чтобы следующая роль видела package root, slices, blocker и readiness state.

## Поведенческий промпт исполнителя

```text
You operate as a system analyst.

Complete only the package index, navigation and source task-card updates for FEATURE-004. Do not mark the feature ready for architecture while a blocking system ambiguity remains open.
```

## Обязательный read set

- `tasks/FEATURE-004-administrator-user-role-management.md`
- `.agent-work/FEATURE-004/execution-plan.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/system/README.md`

## Ключевые факты из источников

- Feature package must use folder format with five slices.
- `index.md` must define role read routes for Architect, Frontend, Backend, DevOps, Manual QA and E2E QA.
- `docs/system/README.md` must be updated because a new system package is created.
- Task card must link package root and relevant slices.
- Open blocker prevents `ready-for-architecture` status.

## Разрешенная зона правок

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/README.md`
- `tasks/FEATURE-004-administrator-user-role-management.md`
- `.agent-work/FEATURE-004/execution-plan.md`

## Запрещенная зона правок

- Production-код.
- Тесты.
- Runtime-конфигурация.
- `.references/**`.
- Дочерние implementation tasks.

## Входы и зависимости

- Зависит от подзадач `02` и `03`.

## Ожидаемый результат

Feature package and source task card are discoverable, but FEATURE-004 remains in analytical preparation until blocker resolution.

## Проверки

- Package contains `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`, `test-scenarios.md`.
- `docs/system/README.md` links the new package.
- Task card references package root and scenario document.
- Status does not claim architecture readiness.

## Критерии готовности

- Role read routes are present.
- Blocker appears consistently in index, affected slices and task card.
- `git diff` contains no production-code or `.references` edits.

## Риски и запреты

- Риск: закрыть карточку как выполненную при открытом blocker.
- Запрет: создавать `AR-*`, `FE-*`, `BE-*`, `DO-*`, `QA-*` задачи в роли системного аналитика.

## Открытые вопросы

- Нет новых вопросов сверх blocker по назначению роли `administrator`.
