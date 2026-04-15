# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Поднять backend foundation для FEATURE-001`
- Описание: `Реализовать backend-срез `FEATURE-001` на NestJS: базовый runtime поднимается, подключается к минимальной конфигурации окружения и публикует минимальный endpoint, пригодный для feature smoke и вызова из frontend foundation. Полные административные контракты `DU-01`, Telegram auth/session, menu management, user access и slot settings в scope этой задачи не входят и реализуются следующими feature-срезами.`
- Единица поставки: `DU-01.F01`
- Роль: `Бэкенд`
- Изменяемый контур: `backend`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-001-feature-001-foundation-slicing.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-001`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/AR-001-feature-001-foundation-slicing.md`, `docs/architecture/du-01-administration.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `NestJS backend foundation поднимает минимальный runtime и предоставляет endpoint, который можно вызвать из frontend foundation и использовать в smoke-проверке `client -> server`.`
- Проверки: `Jest unit tests для bootstrap/config/health-style service logic; интеграционный smoke минимального endpoint и ответа приложения в локальном/test runtime.`
- Обновление карты приложения: `Обязательно при изменении фактических модулей, entrypoints, shared contracts, env/config или deployment path относительно AR-001: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Backend foundation реализован на NestJS, дает воспроизводимый минимальный runtime и не протаскивает в `FEATURE-001` недоставленные административные capability следующих фич.`
