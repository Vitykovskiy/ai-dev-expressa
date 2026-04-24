# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-008`
- Родительская задача: `FEATURE-004`
- Заголовок: `Архитектурное выравнивание FEATURE-004 для полного перехода users boundary на PostgreSQL`
- Описание: Нужно привести в порядок архитектурный handoff `FEATURE-004` после выявленного расхождения между заявленным runtime path и текущим состоянием backend/runtime contour. Задача охватывает ревизию и исправление архитектурной документации по storage/runtime rules, актуализацию backend handoff `BE-001` так, чтобы он явно требовал полный переход users boundary на `PostgreSQL` без runtime in-memory path, а также актуализацию DevOps handoff для внесения соответствующих правок в текущий deploy route. Если действующая DevOps-задача `DO-010` покрывает нужный scope, архитектор обязан привести её в порядок вместо создания дубля; если не покрывает, архитектор должен завести новую `DO-*` задачу с явными границами.
- Единица поставки: `FEATURE-004`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`
- Контурная карта: `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/BE-001-feature-004-users-postgresql-and-role-api.md`, `tasks/DO-010-feature-004-postgresql-runtime-and-delivery.md`

## Примечания

- Зависимости: `AR-007`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `tasks/BE-001-feature-004-users-postgresql-and-role-api.md`, `tasks/DO-010-feature-004-postgresql-runtime-and-delivery.md`
- Ожидаемый результат для ревью: Архитектор устраняет противоречия в architecture handoff по storage/runtime rules, приводит `BE-001` к однозначному требованию полного перехода users boundary на `PostgreSQL` и оставляет после себя актуальную DevOps-задачу для правок текущего deploy route без дублирования scope.
- Проверки: `Проверка, что docs/architecture/stack.md, docs/architecture/application-map/backend-access.md и docs/architecture/application-map/delivery-and-runtime.md однозначно фиксируют PostgreSQL как runtime path users boundary`, `Проверка, что BE-001 не допускает runtime in-memory path и описывает полный переход на PostgreSQL`, `Проверка, что DevOps handoff для текущего deploy route существует в актуальном виде и не дублирует уже существующую задачу без новой семантики`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backend-access.md, docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md; корневая навигация обновляется только при изменении маршрута карт`
- Критерии готовности: Архитектурная документация `FEATURE-004` не содержит двусмысленности по допустимости runtime in-memory path для users boundary; `BE-001` требует полный переход на `PostgreSQL` как целевой runtime path; DevOps contour имеет актуальную `DO-*` задачу для правок текущего deploy route, достаточную для исполнения без чтения соседнего production-кода.
