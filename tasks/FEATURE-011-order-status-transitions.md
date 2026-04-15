# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-011`
- Родительская задача: `Sprint-003`
- Заголовок: `Order status transitions`
- Описание: `Отдельная barista-фича: barista подтверждает, отклоняет, переводит заказ в готовность и закрывает его после выдачи в рамках подтвержденного lifecycle.`
- Единица поставки: `DU-03.F02`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/barista-confirm-order.md`, `docs/business/scenarios/barista-reject-order.md`, `docs/business/scenarios/barista-mark-order-ready.md`, `docs/business/scenarios/barista-close-order.md`
- Требования / правила: `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/state-models/order-lifecycle.md`

## Примечания

- Зависимости: `FEATURE-010`
- Минимальный read set: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/state-models/order-lifecycle.md`
- Ожидаемый результат для ревью: `Barista отдельно проходит сценарий переходов заказа по статусам как самостоятельный vertical slice.`
- Проверки: `Smoke подтверждения, отклонения, готовности и закрытия заказа; unit/integration checks transition-правил.`
- Обновление карты приложения: `Обязательно при изменении lifecycle-модулей, shared contracts или entrypoints.`
- Критерии готовности: `Фича отдельно проверяема и не смешивает transition logic с уведомлениями или availability.`
