# SA-004 Execution Plan

## Назначение

План задает порядок обновления переносимого workflow для подготовки `FEATURE-*` системным аналитиком.

Целевой результат: перед передачей архитектору каждая `FEATURE-*` имеет полный feature package:

- feature spec;
- документ сценариев тестирования фичи;
- диаграмму или текстовое представление сущностей;
- последовательность действий пользователя, привязанную к UI-элементам;
- ограничения инпутов, validations, errors и крайние случаи;
- статус design readiness и явный blocker при неполном прототипе.

## Границы

### Разрешенные изменения

- `process/README.md`
- `process/workflow.md`
- `process/prompts/system-analyst/prompt.md`
- `process/prompts/system-analyst/task-tree-rules.md`
- `process/templates/feature-spec-template.md`
- `process/templates/feature-test-scenarios-template.md`
- `process/templates/task-template-instruction.md`
- корневые файлы `SA-004-context-*.md`

### Запрещенные изменения

- `backend/`
- `frontend/`
- `e2e/`
- `.references/`
- активные feature specs в `docs/system/feature-specs/`
- runtime-конфигурация и production-код

## Подзадачи

1. [x] Обновить process workflow и process navigation.
2. Добавить шаблон `feature-spec-template.md`.
3. Уточнить правила роли системного аналитика.
4. Синхронизировать QA/test scenario/task templates.
5. Проверить согласованность ссылок, терминов и Markdown-таблиц.

## Контекстные пакеты

- `SA-004-context-01-process-feature-workflow.md`
- `SA-004-context-02-feature-spec-template.md`
- `SA-004-context-03-system-analyst-rules.md`
- `SA-004-context-04-qa-and-task-template-alignment.md`
- `SA-004-context-05-consistency-navigation-review.md`

## Проверки

- `rg -n "feature-spec-template|feature test scenarios|design readiness|prototype" process`
- `git diff -- -- . ":(exclude)backend" ":(exclude)frontend" ":(exclude)e2e" ":(exclude).references"`
- Ручная проверка Markdown-таблицы Coverage Matrix.
- Ручная проверка, что workflow позволяет подготовить `FEATURE-003`, `FEATURE-004` и `FEATURE-005` без чтения production-кода.

## Критерии готовности

- В `process/templates/` есть шаблон feature spec.
- `process/workflow.md` описывает feature-level workflow и blocker handling.
- Роль системного аналитика явно обязана анализировать пользовательский сценарий, сущности, UI-bound sequence, input constraints, edge cases и prototype completeness.
- Manual QA и e2e QA используют один документ сценариев тестирования как общий источник проверки.
- Внесенные изменения не затрагивают production-код, тесты, `.references/` и feature-документы.
