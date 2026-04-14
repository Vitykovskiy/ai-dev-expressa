# Карточка задачи

## Карточка задачи

- Идентификатор: `DEV-002`
- Заголовок: `Customer оформляет заказ на выдачу и просматривает историю`
- Описание: `Реализовать поставку customer-facing сценария Expressa v1: customer открывает приложение через Telegram, просматривает настроенное меню, выбирает товары и дополнительные опции, выбирает доступный слот текущего дня, создает заказ и затем просматривает свою историю заказов. Результат должен быть завершенной и демонстрируемой поставкой для customer, а не набором разрозненных технических частей.`
- Единица поставки: `DU-02`
- Роль: `Разработка`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`, `docs/business/scenarios/customer-view-order-history.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-create-pickup-order.md`, `docs/system/use-cases/customer-view-order-history.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`

## Примечания

- Зависимости: `DEV-001`
- Критерии готовности: `Customer может пройти сквозной путь от открытия customer-facing приложения в Telegram до создания заказа на доступный слот текущего дня и просмотра собственной истории заказов, а поставку можно показать заказчику как работающий пользовательский сценарий.`
