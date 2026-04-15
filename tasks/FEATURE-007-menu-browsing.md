# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-007`
- Родительская задача: `Sprint-002`
- Заголовок: `Menu browsing`
- Описание: `Отдельная customer-фича: customer просматривает настроенное меню, категории, позиции и доступные опции без создания заказа.`
- Единица поставки: `DU-02.F02`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`
- Требования / правила: `docs/business/business-rules/menu-catalog-and-options.md`
- Дополнительные материалы: `tasks/Sprint-002-customer-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/customer-ordering.md`

## Примечания

- Зависимости: `FEATURE-006`
- Минимальный read set: `tasks/Sprint-002-customer-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/customer-ordering.md`
- Ожидаемый результат для ревью: `Customer отдельно проходит сценарий просмотра меню без создания заказа.`
- Проверки: `Smoke browsing меню и отображения доступных опций.`
- Обновление карты приложения: `Обязательно при изменении customer web модулей, shared contracts или entrypoints.`
- Критерии готовности: `Фича отдельно проверяема и не смешивает browsing с созданием заказа или историей.`
