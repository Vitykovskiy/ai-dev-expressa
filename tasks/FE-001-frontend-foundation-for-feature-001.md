# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Поднять frontend foundation для FEATURE-001`
- Описание: `Реализовать frontend-срез `FEATURE-001`: базовый клиент поднимается, имеет минимальный shell для запуска и умеет выполнить проверочный запрос в backend foundation, чтобы подтвердить работоспособность связки `client -> server`. Полный административный UI `Меню` / `Пользователи` / `Настройки`, Telegram session flow и role guards в scope этой задачи не входят.`
- Единица поставки: `DU-01.F01`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-002-feature-001-foundation-slicing.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-002`, `BE-001`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-002-feature-001-foundation-slicing.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Frontend foundation поднимает минимальный клиент и подтверждает успешный вызов в backend foundation как первый independently reviewable slice `DU-01`.`
- Проверки: `Vitest unit tests для базового API-adapter/store слоя; ручной или автоматизированный smoke проверки запроса из клиента в backend foundation и отображения успешного ответа.`
- Обновление карты приложения: `Обязательно при изменении фактических путей, entrypoints или shared package относительно AR-002: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Frontend foundation поднимает минимальный shell, не тащит в `FEATURE-001` недоставленные административные вкладки и подтверждает рабочую интеграцию с backend foundation.`
