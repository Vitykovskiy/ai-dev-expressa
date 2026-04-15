# Карточка задачи

## Карточка задачи

- Идентификатор: `Sprint-002`
- Родительская задача: `нет`
- Заголовок: `Sprint 002: customer оформляет заказ на выдачу и просматривает историю`
- Описание: `Реализовать второй спринт Expressa v1, соответствующий delivery unit `DU-02`: customer открывает приложение через Telegram, просматривает настроенное меню, выбирает товары и дополнительные опции, выбирает доступный слот текущего дня, создает заказ и затем просматривает свою историю заказов. Sprint декомпозируется на independently reviewable `FEATURE-*`, а не сразу на полный комплект role-specific child-задач.`
- Единица поставки: `DU-02`
- Роль: `Разработка`
- Изменяемый контур: `sprint`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`, `docs/business/scenarios/customer-view-order-history.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-create-pickup-order.md`, `docs/system/use-cases/customer-view-order-history.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`, `tasks/FEATURE-006-customer-shell-and-session.md`, `tasks/FEATURE-007-menu-browsing.md`, `tasks/FEATURE-008-order-placement.md`, `tasks/FEATURE-009-order-history.md`

## Примечания

- Зависимости: `Sprint-001`
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Собранный спринт `DU-02` дает отдельный customer journey от выбора меню до создания заказа и просмотра истории через набор завершенных `FEATURE-*`.`
- Проверки: `Каждая обязательная feature проходит собственный smoke/scenario; собранный спринт проходит финальный приемочный сценарий customer.`
- Обновление карты приложения: `Обязательно в feature- и child-задачах, если меняются каталоги, entrypoints, shared packages, env/config или deployment path.`
- Критерии готовности: `Customer может пройти сквозной путь от открытия customer-facing приложения в Telegram до создания заказа на доступный слот текущего дня и просмотра собственной истории заказов, а поставку можно показать заказчику как работающий пользовательский сценарий.`
