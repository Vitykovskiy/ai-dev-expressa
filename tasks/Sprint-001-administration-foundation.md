# Карточка задачи

## Карточка задачи

- Идентификатор: `Sprint-001`
- Родительская задача: `нет`
- Заголовок: `Sprint 001: административный контур запуска и управления Expressa v1`
- Описание: `Реализовать первый спринт Expressa v1, соответствующий delivery unit `DU-01`: administrator входит в backoffice через Telegram, управляет меню, рабочими часами и вместимостью слотов, ролями пользователей и блокировкой пользователей. Sprint-карточка является координационной границей инкремента; реализация ведется через backlog фич `FEATURE-*`, каждая из которых должна давать independently reviewable vertical slice.`
- Единица поставки: `DU-01`
- Роль: `Разработка`
- Изменяемый контур: `sprint`
- Приоритет: `Средний`
- Статус: `В работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/du-01/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`, `tasks/FEATURE-001-foundation-runtime-bootstrap.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/FEATURE-003-menu-management.md`, `tasks/FEATURE-004-user-access-management.md`, `tasks/FEATURE-005-slot-settings.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/du-01/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Собранный спринт `DU-01` состоит из завершенных `FEATURE-*` vertical slice и дает рабочий административный контур, который можно отдельно развернуть, проверить и показать stakeholder.`
- Проверки: `Каждая обязательная фича проходит собственный smoke/scenario, а собранный спринт проходит финальный приемочный сценарий administrator.`
- Обновление карты приложения: `Обязательно в feature- и child-задачах, если появляются новые модули, entrypoints, env/config или deployment path.`
- Критерии готовности: `Backlog `FEATURE-001..005` закрыт, administrator может через Telegram открыть backoffice, увидеть свои вкладки, управлять меню, слотами, ролями пользователей и блокировкой, а продукт получает работоспособный административный контур, пригодный для дальнейшей демонстрации и эксплуатации следующих поставок.`
- Блокер: `Не согласовано, может ли любой administrator назначать других administrator, или это право ограничено только главным administrator.`
