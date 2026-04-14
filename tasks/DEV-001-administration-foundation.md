# Карточка задачи

## Карточка задачи

- Идентификатор: `DEV-001`
- Заголовок: `Административный контур запуска и управления Expressa v1`
- Описание: `Реализовать первую поставку Expressa v1: administrator входит в backoffice через Telegram, управляет меню, рабочими часами и вместимостью слотов, ролями пользователей и блокировкой пользователей. Результат должен быть завершенной и демонстрируемой поставкой, которая подготавливает продукт к запуску и к следующим пользовательским сценариям. Внутренняя декомпозиция на доступ, роли, меню и слоты допускается только как дочерние задачи внутри этой карточки.`
- Единица поставки: `DU-01`
- Роль: `Разработка`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/use-cases/administrator-block-user.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

## Примечания

- Зависимости: `нет`
- Критерии готовности: `Administrator может через Telegram открыть backoffice, увидеть свои вкладки, управлять меню, слотами, ролями пользователей и блокировкой, а продукт получает работоспособный административный контур, пригодный для дальнейшей демонстрации и эксплуатации следующих поставок.`
- Блокер: `Не согласовано, может ли любой administrator назначать других administrator, или это право ограничено только главным administrator.`
