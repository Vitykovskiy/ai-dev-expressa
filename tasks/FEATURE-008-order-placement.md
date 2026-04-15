# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-008`
- Родительская задача: `Sprint-002`
- Заголовок: `Order placement`
- Описание: `Отдельная customer-фича: customer выбирает товары, слот текущего дня и создает заказ на выдачу в подтвержденном scope `DU-02`.`
- Единица поставки: `DU-02.F03`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`
- Требования / правила: `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `tasks/Sprint-002-customer-ordering.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-create-pickup-order.md`, `docs/system/state-models/order-lifecycle.md`

## Примечания

- Зависимости: `FEATURE-007`
- Минимальный read set: `tasks/Sprint-002-customer-ordering.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-create-pickup-order.md`, `docs/system/state-models/order-lifecycle.md`
- Ожидаемый результат для ревью: `Customer отдельно проходит сценарий создания заказа как самостоятельный vertical slice.`
- Проверки: `Smoke создания заказа на доступный слот; unit/integration checks правил слотов и заказа.`
- Обновление карты приложения: `Обязательно при изменении ordering модулей, shared contracts, env/config или entrypoints.`
- Критерии готовности: `Фича отдельно демонстрирует создание заказа и не смешивает результат с историей заказов.`
