# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-008`
- Родительская задача: `SPRINT-001`
- Заголовок: `Привести проект к tooling-first подходу`
- Единица поставки: `FEATURE-008`
- Роль: `Архитектор`
- Контурная карта: `docs/architecture/application-map.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Подготовить и выполнить контурное выравнивание проекта с tooling-first правилом: клиентская часть, серверная часть, DevOps/runtime и QA используют штатные возможности назначенных инструментов как базу, а пользовательское поведение и публичные контракты сохраняются.`

## Границы задачи

### Behavioral Requirements

- Система должна привести проектные контуры к tooling-first подходу, зафиксированному в `process/workflow.md`.
- Система должна перед рефакторингом определить назначенный инструмент, библиотеку, каркас разработки, платформу или API для каждого затронутого контура.
- Система должна проверять официальную документацию назначенного инструмента перед созданием или сохранением кастомной реализации.
- Система должна использовать штатную возможность назначенного инструмента как базовый вариант, если она покрывает требуемое поведение и совместима с проектными ограничениями.
- Система должна фиксировать причину отклонения от штатной возможности инструмента в `Результат выполнения` соответствующей контурной задачи.
- Система должна оформлять найденный воспроизводимый дефект как отдельную `BUG-*` задачу с явным контуром причины.

### Scope Constraints

- Process-layer находится вне области изменений этой feature.
- `BUG-004` остается отдельным frontend-дефектом по таблице групп меню и не дублируется в `FE-008`.
- Изменение бизнес-сценариев, системных контрактов, маршрутов, auth semantics, DTO shape, backend error mapping и runtime semantics находится вне области этой feature.
- Реализация выполняется только через дочерние `AR/FE/BE/DO/QA-*` задачи с явно заданной зоной ответственности.

### Safety Constraints

- Система должна сохранять текущее пользовательское поведение административного контура.
- Система должна сохранять текущие public API contracts и response/error contracts.
- Система должна возвращать необходимость изменения поведения в системный или архитектурный слой как blocker.

## Зона ответственности

### Разрешенная зона правок

- `tasks/FEATURE-008-tooling-first-project-alignment.md`
- `tasks/AR-008-tooling-first-architecture-handoff.md`
- `tasks/FE-008-vuetify-first-backoffice-ui-alignment.md`
- `tasks/BE-007-nestjs-first-backend-alignment.md`
- `tasks/DO-010-runtime-and-delivery-tooling-first-alignment.md`
- `tasks/QA-010-manual-tooling-first-regression.md`
- `tasks/QA-011-e2e-tooling-first-regression.md`
- `docs/architecture/**` через дочернюю `AR-008`

### Запрещенная зона правок

- `process/**`
- `frontend/**` напрямую по карточке `FEATURE-008`
- `backend/**` напрямую по карточке `FEATURE-008`
- `e2e/**` напрямую по карточке `FEATURE-008`
- `.references/**`
- `docs/system/**`
- `docs/business/**`

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/README.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

## Справочные ссылки

- `tasks/BUG-004-menu-catalog-category-list-data-table.md` — уже заведенный frontend-дефект по `v-data-table`, не включать повторно в `FE-008`.

## Результат готовности

`FEATURE-008 закрыта, когда AR-008, FE-008, BE-007, DO-010, QA-010 и QA-011 завершены, а найденные tooling-first нарушения либо исправлены в назначенном контуре, либо оформлены отдельными BUG/refactor-задачами или architecture gaps.`

## Проверки

- Проверить наличие дочерних задач `AR-008`, `FE-008`, `BE-007`, `DO-010`, `QA-010`, `QA-011`.
- Проверить, что каждая дочерняя задача содержит назначенные инструменты, ссылки на официальную документацию, границы правок и checks затронутого контура.
- Проверить, что `SPRINT-001` содержит `FEATURE-008` в декомпозиции.

## Результат выполнения

`не заполнено`
