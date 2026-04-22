# Process Documentation

## Назначение

`process/` хранит переносимую процессную документацию. Этот слой определяет рабочий маршрут, ролевые инструкции и шаблоны артефактов без смешивания с проектными фактами.

Проектные документы, task-карточки и локальные термины находятся вне `process/` и подключаются как внешние точки интеграции.

## Состав process-layer

- [workflow.md](./workflow.md) — базовый маршрут работы агента и общие правила процесса.
- [prompts/](./prompts/) — ролевые промпты процесса.
- [templates/](./templates/) — шаблоны process-артефактов, включая [feature-spec-template.md](./templates/feature-spec-template.md) и [feature-test-scenarios-template.md](./templates/feature-test-scenarios-template.md) для `FEATURE-*`.

## Маршрут чтения

1. Прочитать [workflow.md](./workflow.md).
2. Перейти к project-specific точке входа, указанной локальным репозиторным entrypoint.
3. Найти или создать task-card по шаблону из [templates/task-template.md](./templates/task-template.md).
4. Для `FEATURE-*` дополнительно использовать [templates/feature-spec-template.md](./templates/feature-spec-template.md) и [templates/feature-test-scenarios-template.md](./templates/feature-test-scenarios-template.md).
5. Прочитать профильный промпт роли из [prompts/](./prompts/).
6. Работать только по task-card и ее `Минимальный read set`.

Для `FEATURE-*` рядом с feature spec используется документ сценариев тестирования по шаблону [templates/feature-test-scenarios-template.md](./templates/feature-test-scenarios-template.md). Он задает переносимый маршрут ручной проверки и соответствие e2e-тестов задокументированным сценариям.

## Внешние точки интеграции

Process-layer ожидает, что проект снаружи определяет:

- корневой entrypoint репозитория для локальных override;
- проектную навигацию;
- каталоги project docs;
- каталог `tasks/`;
- локальные project-specific словари и карты терминов.

Эти артефакты не являются частью `process/` и не должны дублировать его правила.
