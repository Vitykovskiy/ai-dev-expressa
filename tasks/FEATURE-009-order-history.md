# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-009`
- Родительская задача: `Sprint-002`
- Заголовок: `Order history`
- Описание: `Отдельная customer-фича: customer просматривает собственную историю заказов и статусы ранее созданных заказов.`
- Единица поставки: `DU-02.F04`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-view-order-history.md`
- Требования / правила: `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `tasks/Sprint-002-customer-ordering.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-view-order-history.md`, `docs/system/state-models/order-lifecycle.md`

## Примечания

- Зависимости: `FEATURE-008`
- Минимальный read set: `tasks/Sprint-002-customer-ordering.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/use-cases/customer-view-order-history.md`, `docs/system/state-models/order-lifecycle.md`
- Ожидаемый результат для ревью: `Customer отдельно проходит сценарий просмотра истории заказов как самостоятельный vertical slice.`
- Проверки: `Smoke просмотра собственной истории и статусов заказов.`
- Обновление карты приложения: `Обязательно при изменении history-модулей, shared contracts или entrypoints.`
- Критерии готовности: `Фича отдельно проверяема и не смешивает историю с созданием нового заказа.`
