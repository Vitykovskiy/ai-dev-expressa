# Карточка задачи

## Карточка задачи

- Идентификатор: `SA-002`
- Родительская задача: `нет`
- Заголовок: `Нарезать поставки Expressa v1 в задачи для разработки`
- Описание: `На основе утвержденных системных артефактов Expressa v1 подготовить комплект верхнеуровневых карточек SPRINT-* в каталоге tasks/ для передачи в архитектурную проработку и разработку. Каждая карточка должна описывать один спринт как координационный контейнер для будущих FEATURE-*, а законченная, тестируемая и демонстрируемая поставка должна появляться уже на уровне фичи. Внутренние технические части решения не должны оформляться как отдельные верхнеуровневые задачи, если они не образуют самостоятельную фичу.`
- Единица поставки: `n/a`
- Роль: `Системный аналитик`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`, `docs/business/scenarios/customer-view-order-history.md`, `docs/business/scenarios/barista-confirm-order.md`, `docs/business/scenarios/barista-reject-order.md`, `docs/business/scenarios/barista-mark-order-ready.md`, `docs/business/scenarios/barista-close-order.md`, `docs/business/scenarios/barista-manage-menu-availability.md`, `docs/business/scenarios/barista-receive-order-reminder.md`, `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/order-lifecycle-and-history.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `docs/system/README.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `templates/task-template.md`, `templates/task-template-instruction.md`

## Примечания

- Зависимости: `SA-001`, актуальный комплект системных артефактов в `docs/system/`
- Критерии готовности: `В каталоге tasks/ созданы или обновлены карточки SPRINT-* для разработки, каждая карточка описывает один спринт, содержит минимальный релевантный набор ссылок на docs/system, фиксирует зависимости и не подменяет собой будущие FEATURE-* как единицы поставки.`

## Результат

- `SPRINT-001` — административный контур запуска и управления продуктом
- `SPRINT-002` — customer оформляет заказ на выдачу и просматривает историю заказов
- `SPRINT-003` — barista обрабатывает заказ end-to-end, а система отправляет связанные уведомления
