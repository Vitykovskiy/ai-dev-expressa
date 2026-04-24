# Process Documentation

## Назначение

`process/` хранит переносимую процессную документацию. Этот слой определяет рабочий маршрут, ролевые инструкции и шаблоны артефактов без смешивания с проектными фактами.

Проектные документы, task-карточки и локальные термины находятся вне `process/` и подключаются как внешние точки интеграции.

## Состав process-layer

- [workflow.md](./workflow.md) — базовый маршрут работы агента и общие правила процесса.
- [prompts/](./prompts/) — ролевые промпты процесса.
- [templates/](./templates/) — шаблоны process-артефактов, сгруппированные по типам:
  - [tasks/](./templates/tasks/) — task-card template и инструкция по заполнению.
  - [feature-specs/](./templates/feature-specs/) — decomposed feature package templates и инструкция для `FEATURE-*`.
  - [context-packages/](./templates/context-packages/) — шаблон контекстного пакета подзадачи.

## Маршрут чтения

1. Прочитать [workflow.md](./workflow.md).
2. Перейти к project-specific точке входа, указанной локальным репозиторным entrypoint.
3. Найти или создать task-card по шаблону из [templates/tasks/task-template.md](./templates/tasks/task-template.md).
4. Для `FEATURE-*` дополнительно использовать [templates/feature-specs/feature-spec-package-instruction.md](./templates/feature-specs/feature-spec-package-instruction.md) и package slice templates.
5. Прочитать профильный промпт роли из [prompts/](./prompts/).
6. Работать только по task-card и ее `Маршрут чтения` или legacy `Минимальный read set`.

Для новых `FEATURE-*` системный аналитик формирует decomposed feature package в `docs/system/feature-specs/<feature-id>-<slug>/`. Package содержит `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md` и `test-scenarios.md`. Он является основным механизмом оптимизации передаваемого агентам контекста: task-card и `index.md` назначают роли только релевантные slices и точечные supporting sources.

Для существующих flat feature specs допустим legacy format `docs/system/feature-specs/<feature-id>-<slug>.md` и sibling `.test-scenarios.md` до ближайшего системно-аналитического обновления фичи.

## Внешние точки интеграции

Process-layer ожидает, что проект снаружи определяет:

- корневой entrypoint репозитория для локальных override;
- проектную навигацию;
- каталоги project docs;
- каталог `tasks/`;
- локальные project-specific словари и карты терминов.

Эти артефакты не являются частью `process/` и не должны дублировать его правила.
