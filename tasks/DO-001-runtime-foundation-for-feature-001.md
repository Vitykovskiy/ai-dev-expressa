# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Собрать runtime foundation для FEATURE-001`
- Описание: `Подготовить локальный и lightweight test runtime для `FEATURE-001`: базовый маршрут запуска только backend foundation и frontend foundation, минимальные env templates `API_PORT`, `API_CORS_ALLOWED_ORIGIN`, `VITE_API_BASE_URL`, smoke-check для связки `client -> server` и понятный путь доставки первого vertical slice. Полный delivery-маршрут всего административного спринта, bot entrypoint, Telegram auth/session, `PostgreSQL` и остальные контуры `DU-01` в scope этой задачи не входят.`
- Единица поставки: `DU-01.F01`
- Роль: `Девопс`
- Изменяемый контур: `devops`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-001-feature-001-foundation-slicing.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-001`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-001-feature-001-foundation-slicing.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Runtime foundation `FEATURE-001` воспроизводимо поднимается локально или на lightweight test-стенде, использует только `api + backoffice-web` и проходит smoke-check связки `client -> server`.`
- Проверки: `Локальный запуск или эквивалентный runtime для backend foundation и frontend foundation; pipeline validation install/test/build для foundation-среза; smoke-check root shell `/` -> `GET /api/foundation/health` -> ответ `{ status: 'ok', service: 'api' }`.`
- Обновление карты приложения: `Обязательно при изменении runtime-контуров, env vars, deployment path, pipeline stages или smoke-check: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Foundation runtime для `FEATURE-001` поднят без customer/barista-контуров, все обязательные env vars описаны, а smoke-путь `client -> server` воспроизводим без догадок.`
