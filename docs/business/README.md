# Карта документации `docs/business`

Этот файл нужен только для навигации по бизнес-артефактам. Источником правды являются документы в соответствующих семействах.

## Как искать документ

- Если нужен бизнес-замысел, целевое состояние, scope и критерии успеха: `vision`.
- Если нужно значение термина в границах продукта: `glossary`.
- Если нужно правило, ограничение или политика принятия решения: `business-rules`.
- Если нужен путь от триггера до исхода для одного актора: `scenarios`.

## Семейства артефактов

### `vision`

- `Expressa v1: Telegram-центричный заказ на выдачу`
  - Файл: [vision/expressa-v1-telegram-ordering.md](./vision/expressa-v1-telegram-ordering.md)
  - Использовать, если нужно понять бизнес-цель, целевое состояние, scope v1, допущения, критерии успеха и открытые вопросы уровня продукта.

### `glossary`

- `Заказ на выдачу через Telegram`
  - Файл: [glossary/telegram-ordering-v1.md](./glossary/telegram-ordering-v1.md)
  - Использовать, если нужно уточнить значение ролей, каналов доступа, сущностей меню, слотов и истории заказов.

### `business-rules`

- `Доступ и роли`
  - Файл: [business-rules/access-and-roles.md](./business-rules/access-and-roles.md)
  - Использовать для правил Telegram-доступа, ролей, блокировки и ролевого разграничения.

- `Каталог, товары и дополнительные опции`
  - Файл: [business-rules/menu-catalog-and-options.md](./business-rules/menu-catalog-and-options.md)
  - Использовать для правил категорий, товаров, размеров напитков и дополнительных опций.

- `Слоты выдачи и вместимость`
  - Файл: [business-rules/pickup-slots-and-capacity.md](./business-rules/pickup-slots-and-capacity.md)
  - Использовать для правил рабочих часов, горизонта слотов, шага слота и вместимости.

- `Жизненный цикл заказа и история заказов`
  - Файл: [business-rules/order-lifecycle-and-history.md](./business-rules/order-lifecycle-and-history.md)
  - Использовать для статусов заказа, создания заказа, уведомлений и истории заказов.

- `Операционная работа backoffice`
  - Файл: [business-rules/backoffice-operations.md](./business-rules/backoffice-operations.md)
  - Использовать для действий barista и administrator в backoffice, напоминаний, аудита и вкладок.

### `scenarios`

- `Customer оформляет заказ на выдачу`
  - Файл: [scenarios/customer-place-pickup-order.md](./scenarios/customer-place-pickup-order.md)
  - Точка входа для сценария заказа customer.

- `Customer просматривает историю заказов`
  - Файл: [scenarios/customer-view-order-history.md](./scenarios/customer-view-order-history.md)
  - Точка входа для сценария истории заказов customer.

- `Barista подтверждает заказ`
  - Файл: [scenarios/barista-confirm-order.md](./scenarios/barista-confirm-order.md)
  - Точка входа для принятия заказа в работу.

- `Barista отклоняет заказ`
  - Файл: [scenarios/barista-reject-order.md](./scenarios/barista-reject-order.md)
  - Точка входа для отказа в обработке заказа.

- `Barista отмечает заказ готовым к выдаче`
  - Файл: [scenarios/barista-mark-order-ready.md](./scenarios/barista-mark-order-ready.md)
  - Точка входа для перевода заказа в готовность к выдаче.

- `Barista закрывает заказ после выдачи`
  - Файл: [scenarios/barista-close-order.md](./scenarios/barista-close-order.md)
  - Точка входа для завершения заказа.

- `Barista временно меняет доступность меню`
  - Файл: [scenarios/barista-manage-menu-availability.md](./scenarios/barista-manage-menu-availability.md)
  - Точка входа для оперативного управления доступностью.

- `Barista получает напоминание о заказах, ожидающих действий`
  - Файл: [scenarios/barista-receive-order-reminder.md](./scenarios/barista-receive-order-reminder.md)
  - Точка входа для сценария операционного напоминания.

- `Administrator управляет меню`
  - Файл: [scenarios/administrator-manage-menu.md](./scenarios/administrator-manage-menu.md)
  - Точка входа для изменения каталога и дополнительных опций.

- `Administrator управляет рабочими часами и вместимостью слотов`
  - Файл: [scenarios/administrator-manage-slot-settings.md](./scenarios/administrator-manage-slot-settings.md)
  - Точка входа для изменения параметров выдачи.

- `Administrator управляет ролями пользователей`
  - Файл: [scenarios/administrator-manage-users-and-roles.md](./scenarios/administrator-manage-users-and-roles.md)
  - Точка входа для назначения ролей.

- `Administrator блокирует пользователя`
  - Файл: [scenarios/administrator-block-user.md](./scenarios/administrator-block-user.md)
  - Точка входа для блокировки доступа.

## Быстрый маршрут для агентов

- Если запрос про `кто может` или `через что доступ`: начинать с `business-rules/access-and-roles.md`.
- Если запрос про `что можно заказать` или `как настраивается товар`: начинать с `business-rules/menu-catalog-and-options.md`.
- Если запрос про `когда можно получить заказ`: начинать с `business-rules/pickup-slots-and-capacity.md`.
- Если запрос про `в каком статусе заказ` или `что видит customer`: начинать с `business-rules/order-lifecycle-and-history.md`.
- Если запрос про `что делает barista` или `что делает administrator`: начинать с `business-rules/backoffice-operations.md`.
- Если нужен конкретный путь пользователя: переходить сразу в `scenarios/`.
