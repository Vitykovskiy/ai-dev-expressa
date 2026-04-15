# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-002`
- Родительская задача: `FEATURE-001`
- Заголовок: `Зафиксировать архитектурный контур FEATURE-001`
- Описание: `На основе `Sprint-001` и утвержденной архитектурной рамки `DU-01` зафиксировать контур стартовой фичи `FEATURE-001`: какие минимальные runtime-элементы, entrypoints, env vars и smoke-проверки нужны, чтобы получить первый independently reviewable slice `client -> server`. После фиксации контура разрешается работа по `BE-001`, `FE-001` и `DO-001`.`
- Единица поставки: `DU-01.F01`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-001`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Для `FEATURE-001` зафиксирован минимальный архитектурный контур первого working slice с явными границами для backend, frontend и devops.`
- Проверки: `Обновлены релевантные архитектурные артефакты при необходимости; scope `FEATURE-001` не содержит административные capability следующих фич и допускает отдельный smoke `client -> server`.`
- Обновление карты приложения: `Обязательно при изменении модулей, entrypoints, env/config, run/test/deploy path: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `После завершения `AR-002` `BE-001`, `FE-001` и `DO-001` не оставляют implementer-у решений по контурной декомпозиции foundation-среза.`
