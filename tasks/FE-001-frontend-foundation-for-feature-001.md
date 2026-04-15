# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Поднять frontend foundation для FEATURE-001`
- Описание: `Реализовать frontend-срез `FEATURE-001`: `apps/backoffice-web` поднимает минимальный foundation shell по root route `/`, использует `VITE_API_BASE_URL`, умеет выполнить проверочный запрос `GET /api/foundation/health` в backend foundation и отображает typed-ответ, чтобы подтвердить работоспособность связки `client -> server`. Прямой доступ по URL допустим только для foundation-smoke в local/test runtime. Полный административный UI `Меню` / `Пользователи` / `Настройки`, Telegram session flow, role guards и отдельный bot entrypoint в scope этой задачи не входят.`
- Единица поставки: `DU-01.F01`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-001-feature-001-foundation-slicing.md`, `docs/architecture/du-01/features/feature-001-foundation-runtime.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-001`, `BE-001`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-001-feature-001-foundation-slicing.md`, `docs/architecture/du-01/features/feature-001-foundation-runtime.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Frontend foundation поднимает минимальный клиент, вызывает `GET /api/foundation/health` и отображает typed-ответ как первый independently reviewable slice `DU-01.F01`.`
- Проверки: `Vitest unit tests для базового API-adapter/store слоя; ручной или автоматизированный smoke проверки запроса из root shell `/` в backend foundation и отображения ответа `{ status: 'ok', service: 'api' }`.`
- Обновление карты приложения: `Обязательно при изменении фактических путей, entrypoints или shared package относительно AR-001: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Frontend foundation поднимает минимальный shell, не тащит в `FEATURE-001` недоставленные административные вкладки и подтверждает рабочую интеграцию с backend foundation.`
