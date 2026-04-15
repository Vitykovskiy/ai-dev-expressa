# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-013`
- Родительская задача: `Sprint-003`
- Заголовок: `Notifications and reminders`
- Описание: `Отдельная фича третьего спринта: система отправляет customer уведомления о смене статуса заказа и barista напоминания о заказах, ожидающих действий.`
- Единица поставки: `DU-03.F04`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/barista-receive-order-reminder.md`, `docs/business/scenarios/barista-confirm-order.md`, `docs/business/scenarios/barista-mark-order-ready.md`
- Требования / правила: `docs/business/business-rules/order-lifecycle-and-history.md`
- Дополнительные материалы: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/telegram-notifications.md`, `docs/system/use-cases/barista-receive-order-reminder.md`

## Примечания

- Зависимости: `FEATURE-011`
- Минимальный read set: `tasks/Sprint-003-barista-order-processing.md`, `docs/system/contracts/telegram-notifications.md`, `docs/system/use-cases/barista-receive-order-reminder.md`
- Ожидаемый результат для ревью: `Система отдельно демонстрирует связанные уведомления и напоминания как самостоятельный vertical slice.`
- Проверки: `Smoke статусов и уведомлений; проверка напоминаний barista в пределах утвержденной периодичности или зафиксированного блокера.`
- Обновление карты приложения: `Обязательно при изменении notification flow, env/config или deploy/runtime path.`
- Критерии готовности: `Фича отдельно проверяема и не смешивает notification flow с незавершенными transition capability вне своих зависимостей.`
