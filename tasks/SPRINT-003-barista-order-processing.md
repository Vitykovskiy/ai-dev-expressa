# Карточка задачи

## Карточка задачи

- Идентификатор: `SPRINT-003`
- Родительская задача: `нет`
- Заголовок: `Barista обрабатывает заказ end-to-end и система рассылает статусы`
- Описание: `Спринт 003 задает координационные рамки для операционного сценария barista в Expressa v1. Внутри спринта архитектор должен сначала нарезать работу на отдельные FEATURE-*, а затем каждая выбранная фича отдельно доводится до законченного и тестируемого результата. Спринт охватывает обработку входящих заказов, смену статусов, закрытие после выдачи, управление доступностью меню и связанные уведомления, но сам не является единицей поставки.`
- Единица поставки: `n/a`
- Роль: `Разработка`
- Изменяемый контур: `n/a`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/telegram-notifications.md`, `docs/system/use-cases/barista-confirm-order.md`, `docs/system/use-cases/barista-reject-order.md`, `docs/system/use-cases/barista-mark-order-ready.md`, `docs/system/use-cases/barista-close-order.md`, `docs/system/use-cases/barista-manage-menu-availability.md`, `docs/system/use-cases/barista-receive-order-reminder.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `docs/business/vision/expressa-v1-telegram-ordering.md`, `docs/business/scenarios/barista-confirm-order.md`, `docs/business/scenarios/barista-reject-order.md`, `docs/business/scenarios/barista-mark-order-ready.md`, `docs/business/scenarios/barista-close-order.md`, `docs/business/scenarios/barista-manage-menu-availability.md`, `docs/business/scenarios/barista-receive-order-reminder.md`, `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/order-lifecycle-and-history.md`, `docs/business/business-rules/backoffice-operations.md`, `docs/business/business-rules/menu-catalog-and-options.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `SPRINT-001`, `SPRINT-002`
- Минимальный read set: `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/contracts/backoffice-order-processing.md`, `docs/system/contracts/telegram-notifications.md`, `docs/system/state-models/order-lifecycle.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Для SPRINT-003 определен и реализуется согласованный набор FEATURE-*, который в сумме покрывает операционный путь barista и связанные уведомления как набор отдельных завершенных фич.`
- Проверки: `Каждая FEATURE-* внутри спринта проходит свои обязательные проверки, включая модульные тесты, e2e, дымовые проверки и приемочный сценарий по затронутой функциональности.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются каталоги, entrypoints, env/config, notification flow или deployment path.`
- Критерии готовности: `Спринт закрывается только после того, как все включенные в него FEATURE-* завершены, протестированы и в сумме дают завершенный операционный контур для barista.`
- Блокер: `Не определена периодичность Telegram-напоминаний barista о заказах, ожидающих действий.`
