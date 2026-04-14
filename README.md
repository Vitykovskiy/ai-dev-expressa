# Expressa

Корневой README описывает структуру репозитория и помогает быстро найти нужные артефакты проекта.

## Структура проекта

```text
.
|-- docs/
|   `-- business/
|       |-- README.md
|       |-- business-rules/
|       |-- glossary/
|       |-- scenarios/
|       `-- vision/
|-- tasks/
|   `-- .gitkeep
|-- templates/
|   |-- task-template-instruction.md
|   `-- task-template.md
`-- Expressa — Требования к продукту.txt
```

## Что где находится

- `docs/` — проектная документация.
- `docs/business/` — бизнес-артефакты по продукту Expressa.
- `docs/business/vision/` — vision-документы с границами, целями и scope.
- `docs/business/scenarios/` — пользовательские и операционные сценарии.
- `docs/business/business-rules/` — бизнес-правила и ограничения.
- `docs/business/glossary/` — термины и определения предметной области.
- `docs/business/README.md` — карта документации по бизнес-разделу.
- `templates/` — шаблоны артефактов и инструкции по их заполнению.
- `tasks/` — каталог для итоговых задач проекта. Все оформленные и актуальные задачи нужно складывать сюда.
- `Expressa — Требования к продукту.txt` — исходный текст требований к продукту.

## Работа с задачами

- Новые задачи оформляются по шаблону из `templates/`.
- Итоговые задачи хранятся в каталоге `tasks/`.

## Выбор задачи

- В работу берется задача из комбинации статуса `Готова к работе` и приоритета.
- Сначала отбираются только задачи со статусом `Готова к работе`.
- Из списка задач со статусом `Готова к работе` выбирается задача с наивысшим приоритетом.
- Детализация правил выбора задачи будет дополнена позже.

## Быстрый маршрут

- Если нужен общий контекст продукта, начинайте с [docs/business/vision/expressa-v1-telegram-ordering.md](./docs/business/vision/expressa-v1-telegram-ordering.md).
- Если нужно понять состав бизнес-документов, откройте [docs/business/README.md](./docs/business/README.md).
- Если нужно завести новую задачу, используйте [templates/task-template.md](./templates/task-template.md) и [templates/task-template-instruction.md](./templates/task-template-instruction.md).
