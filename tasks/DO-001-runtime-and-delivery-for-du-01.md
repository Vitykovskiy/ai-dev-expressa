# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-001`
- Родительская задача: `DEV-001`
- Заголовок: `Собрать runtime и delivery-маршрут DU-01`
- Описание: `Подготовить локальный и целевой delivery-маршрут для административного среза DU-01: PostgreSQL, apps/api, apps/backoffice-web, apps/backoffice-bot, env templates, CI/CD pipeline, deploy smoke-check и rollback path. В задачу не входят customer runtime и barista reminder flow из следующих поставок.`
- Единица поставки: `DU-01`
- Роль: `Девопс`
- Изменяемый контур: `devops`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Административный контур DU-01 воспроизводимо поднимается локально и проходит CI/deploy путь с документированным smoke-check и rollback.`
- Проверки: `Docker Compose или эквивалентный локальный запуск api/web/bot/postgres; pipeline validation install/lint/test/build; deploy smoke-check сценария administrator; документированный rollback/restore path.`
- Обновление карты приложения: `Обязательно при изменении runtime-контуров, env vars, deployment path, pipeline stages или smoke-check: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `DU-01 имеет отдельный runtime slice без customer-контуров, все обязательные env vars описаны, а путь от merge до проверенного deployment восстанавливается по репозиторию без догадок.`
