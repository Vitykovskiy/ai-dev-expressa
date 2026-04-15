# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-001`
- Родительская задача: `Sprint-001`
- Заголовок: `Foundation/runtime bootstrap`
- Описание: `Первая фича `Sprint-001` должна поднять минимальное рабочее окружение `DU-01.F01`: `apps/api` публикует foundation endpoint `GET /api/foundation/health`, `apps/backoffice-web` выполняет запрос в backend foundation, `packages/shared-types` фиксирует DTO ответа, а devops обеспечивает локальный или lightweight test runtime и smoke-маршрут. Эта фича нужна, чтобы дальнейшие административные capability развивались поверх уже работающей связки `client -> server`; `apps/backoffice-bot`, Telegram auth/session, `PostgreSQL` и административные контракты следующих фич в её scope не входят.`
- Единица поставки: `DU-01.F01`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`
- Требования / правила: `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `docs/architecture/du-01/features/feature-001-foundation-runtime.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `docs/architecture/du-01/features/feature-001-foundation-runtime.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Есть первый independently reviewable vertical slice `DU-01.F01`: root shell `apps/backoffice-web` вызывает `GET /api/foundation/health` в `apps/api` и получает typed-ответ `{ status: 'ok', service: 'api' }`.`
- Проверки: `Feature smoke `client -> server` через root shell `apps/backoffice-web`; локальный или lightweight test runtime bootstrap только для `api + backoffice-web`; базовые unit/integration checks foundation-компонентов.`
- Обновление карты приложения: `Обязательно при появлении новых runtime-контуров, entrypoints, env/config или smoke/deploy path.`
- Критерии готовности: `Фича дает отдельный проверяемый результат без административных capability следующих фич и служит foundation для дальнейшего спринта.`
