# Карточка задачи

## Карточка задачи

- Идентификатор: `Sprint-003`
- Родительская задача: `нет`
- Заголовок: `Sprint 003: barista обрабатывает заказ end-to-end и система рассылает статусы`
- Описание: `Реализовать третий спринт Expressa v1, соответствующий delivery unit `DU-03`: barista открывает backoffice через Telegram, видит входящие заказы, подтверждает или отклоняет их, переводит в статус готовности, закрывает после выдачи, временно управляет доступностью меню, а система отправляет customer уведомления о смене статуса и barista напоминания о заказах, ожидающих действий. Sprint декомпозируется на independently reviewable `FEATURE-*`, а не на разрозненные технические задачи.`
- Единица поставки: `DU-03`
- Роль: `Разработка`
- Изменяемый контур: `sprint`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/barista-confirm-order.md`, `docs/business/scenarios/barista-reject-order.md`, `docs/business/scenarios/barista-mark-order-ready.md`, `docs/business/scenarios/barista-close-order.md`, `docs/business/scenarios/barista-manage-menu-availability.md`, `docs/business/scenarios/barista-receive-order-reminder.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/order-lifecycle-and-history.md`, `docs/business/business-rules/backoffice-operations.md`, `docs/business/business-rules/menu-catalog-and-options.md`
- Дополнительные материалы: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/telegram-notifications.md`, `docs/system/use-cases/barista-confirm-order.md`, `docs/system/use-cases/barista-reject-order.md`, `docs/system/use-cases/barista-mark-order-ready.md`, `docs/system/use-cases/barista-close-order.md`, `docs/system/use-cases/barista-manage-menu-availability.md`, `docs/system/use-cases/barista-receive-order-reminder.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`, `tasks/FEATURE-010-barista-order-inbox.md`, `tasks/FEATURE-011-order-status-transitions.md`, `tasks/FEATURE-012-menu-availability.md`, `tasks/FEATURE-013-notifications-and-reminders.md`

## Примечания

- Зависимости: `Sprint-001`, `Sprint-002`
- Минимальный read set: `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/contracts/telegram-notifications.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Собранный спринт `DU-03` дает barista рабочий end-to-end контур обработки заказа и связанные уведомления как единый reviewable результат через набор завершенных `FEATURE-*`.`
- Проверки: `Каждая обязательная feature проходит собственный smoke/scenario; собранный спринт проходит финальный приемочный сценарий barista.`
- Обновление карты приложения: `Обязательно в feature- и child-задачах, если меняются каталоги, entrypoints, env/config, notification flow или deployment path.`
- Критерии готовности: `Barista может через Telegram backoffice провести заказ от входящего состояния до закрытия, временно менять доступность меню в пределах своей роли, система фиксирует audit ключевых действий и отправляет связанные customer-уведомления и barista-напоминания, так что поставку можно показать заказчику как завершенный операционный контур.`
- Блокер: `Не определена периодичность Telegram-напоминаний barista о заказах, ожидающих действий.`
