# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-010`
- Родительская задача: `Sprint-003`
- Заголовок: `Barista order inbox`
- Описание: `Стартовая barista-фича третьего спринта: barista открывает backoffice, видит входящие заказы и может начать работу с очередью как с отдельным vertical slice.`
- Единица поставки: `DU-03.F01`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/barista-confirm-order.md`
- Требования / правила: `docs/business/business-rules/backoffice-operations.md`, `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

## Примечания

- Зависимости: `Sprint-001`, `Sprint-002`
- Минимальный read set: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Barista отдельно получает рабочий inbox входящих заказов как стартовый slice операционного контура.`
- Проверки: `Smoke отображения очереди заказов и базовых guard/visibility правил.`
- Обновление карты приложения: `Обязательно при изменении backoffice entrypoints, env/config или runtime path.`
- Критерии готовности: `Фича отдельно демонстрирует inbox без статусов, уведомлений и временной доступности меню.`
