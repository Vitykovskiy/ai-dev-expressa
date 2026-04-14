# Expressa

Корневой README описывает структуру репозитория и помогает быстро найти нужные артефакты проекта.

## Структура проекта

```text
.
|-- docs/
|   |-- business/
|   |   |-- README.md
|   |   |-- business-rules/
|   |   |-- glossary/
|   |   |-- scenarios/
|   |   `-- vision/
|   `-- system/
|       |-- README.md
|       |-- contracts/
|       |-- domain-model/
|       |-- state-models/
|       |-- system-context/
|       `-- use-cases/
|-- prompts/
|   |-- business-analyst/
|   |   `-- prompt.md
|   `-- system-analyst/
|       `-- prompt.md
|-- tasks/
|   `-- SA-001-system-analysis-based-on-business-requirements.md
|-- templates/
|   |-- task-template-instruction.md
|   `-- task-template.md
`-- Expressa — Требования к продукту.txt
```

## Что где находится

- `docs/` — проектная документация.
- `docs/business/` — бизнес-артефакты по продукту Expressa.
- `docs/system/` — системные артефакты по продукту Expressa.
- `docs/business/vision/` — vision-документы с границами, целями и scope.
- `docs/business/scenarios/` — пользовательские и операционные сценарии.
- `docs/business/business-rules/` — бизнес-правила и ограничения.
- `docs/business/glossary/` — термины и определения предметной области.
- `docs/business/README.md` — карта документации по бизнес-разделу.
- `docs/system/system-context/` — границы системы, внешние акторы, delivery units и системные ограничения.
- `docs/system/domain-model/` — системные сущности, связи и инварианты доменной модели.
- `docs/system/use-cases/` — системное поведение по отдельным сценариям и исходам.
- `docs/system/contracts/` — контракты взаимодействий, входы, выходы, проверки и ошибки.
- `docs/system/state-models/` — модели состояний и допустимые переходы сущностей.
- `docs/system/README.md` — карта документации по системному разделу.
- `prompts/` — системные промпты для рабочих ролей и агентов проекта.
- `prompts/business-analyst/prompt.md` — промпт бизнес-аналитика для подготовки и актуализации бизнес-артефактов.
- `prompts/system-analyst/prompt.md` — промпт системного аналитика для проработки системных требований и проектирования решений.
- `templates/` — шаблоны артефактов и инструкции по их заполнению.
- `tasks/` — каталог для итоговых задач проекта. Все оформленные и актуальные задачи нужно складывать сюда.
- `tasks/SA-001-system-analysis-based-on-business-requirements.md` — задача на системный анализ на основе подготовленных бизнес-требований.
- `Expressa — Требования к продукту.txt` — исходный текст требований к продукту.

## Работа с задачами

- Новые задачи оформляются по шаблону из `templates/`.
- Итоговые задачи хранятся в каталоге `tasks/`.
- Аналитические роли используют промпты из каталога `prompts/`.

## Выбор задачи

- В работу берется задача из комбинации статуса `Готова к работе` и приоритета.
- Сначала отбираются только задачи со статусом `Готова к работе`.
- Из списка задач со статусом `Готова к работе` выбирается задача с наивысшим приоритетом.
- Детализация правил выбора задачи будет дополнена позже.

## Быстрый маршрут

- Если нужен общий контекст продукта, начинайте с [docs/business/vision/expressa-v1-telegram-ordering.md](./docs/business/vision/expressa-v1-telegram-ordering.md).
- Если нужно понять состав бизнес-документов, откройте [docs/business/README.md](./docs/business/README.md).
- Если нужно понять состав системных документов, откройте [docs/system/README.md](./docs/system/README.md).
- Если нужно запустить работу аналитической роли, используйте [prompts/business-analyst/prompt.md](./prompts/business-analyst/prompt.md) или [prompts/system-analyst/prompt.md](./prompts/system-analyst/prompt.md).
- Если нужно завести новую задачу, используйте [templates/task-template.md](./templates/task-template.md) и [templates/task-template-instruction.md](./templates/task-template-instruction.md).
