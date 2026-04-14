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
- `tasks/` — каталог для заведенных задач проекта.
- `Expressa — Требования к продукту.txt` — исходный текст требований к продукту.

## Быстрый маршрут

- Если нужно понять состав бизнес-документов, откройте [docs/business/README.md](./docs/business/README.md).
- Если нужно завести новую задачу, используйте [templates/task-template.md](./templates/task-template.md) и [templates/task-template-instruction.md](./templates/task-template-instruction.md).
