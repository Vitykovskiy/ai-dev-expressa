# Карта документации `docs/system`

Этот файл нужен только для навигации по системным артефактам. Источником правды являются документы в соответствующих семействах.

## Как искать документ

- Если нужно понять границы системы, внешние роли, Telegram-точки входа, системные срезы для анализа и зафиксированные несогласованности: `system-context`.
- Если нужно понять верхнеуровневые задачи поставки и их зависимости: переходите в `tasks/`, а не в `system-context`.
- Если нужно понять сущности, связи и инварианты предметной области: `domain-model`.
- Если нужно понять поведение системы от триггера до исхода: `use-cases`.
- Если нужно понять входы, выходы, проверки, ошибки и side effects конкретного взаимодействия: `contracts`.
- Если нужно понять жизненный цикл заказа и допустимые переходы: `state-models`.
- Если нужно понять, как экран, действие, UI-state или role-guard связаны с системным поведением: `ui-behavior-mapping`.
- Если нужен входной UI-указатель на канонический визуальный источник и системные ограничения: `ui-contracts`.

## Семейства артефактов

### `system-context`

- `Expressa v1 Telegram Ordering`
  - Файл: [system-context/expressa-v1-telegram-ordering.md](./system-context/expressa-v1-telegram-ordering.md)
  - Использовать, если нужно быстро зафиксировать границы продукта, внешних акторов, системную ответственность, системные срезы для анализа, ограничения и открытые вопросы верхнего уровня.

### `domain-model`

- `Identity And Access`
  - Файл: [domain-model/identity-and-access.md](./domain-model/identity-and-access.md)
  - Использовать для ролей, Telegram-идентификации, блокировки доступа и ограничений по вкладкам backoffice.

- `Menu Catalog`
  - Файл: [domain-model/menu-catalog.md](./domain-model/menu-catalog.md)
  - Использовать для структуры меню, товаров, размеров напитков, групп дополнительных опций и временной доступности.

- `Ordering And Pickup`
  - Файл: [domain-model/ordering-and-pickup.md](./domain-model/ordering-and-pickup.md)
  - Использовать для корзины, заказа, слотов выдачи, вместимости и audit-атрибутов по заказу.

### `state-models`

- `Order Lifecycle`
  - Файл: [state-models/order-lifecycle.md](./state-models/order-lifecycle.md)
  - Использовать для допустимых состояний заказа, переходов, guard-условий и терминальных состояний.

### `use-cases`

- `Customer Create Pickup Order`
  - Файл: [use-cases/customer-create-pickup-order.md](./use-cases/customer-create-pickup-order.md)
  - Использовать для customer-флоу от открытия customer-приложения до создания заказа.

- `Customer View Order History`
  - Файл: [use-cases/customer-view-order-history.md](./use-cases/customer-view-order-history.md)
  - Использовать для просмотра customer собственной истории заказов.

- `Barista Confirm Order`
  - Файл: [use-cases/barista-confirm-order.md](./use-cases/barista-confirm-order.md)
  - Использовать для перевода заказа из `Создан` в `Подтвержден`.

- `Barista Reject Order`
  - Файл: [use-cases/barista-reject-order.md](./use-cases/barista-reject-order.md)
  - Использовать для отклонения заказа с обязательной причиной.

- `Barista Mark Order Ready`
  - Файл: [use-cases/barista-mark-order-ready.md](./use-cases/barista-mark-order-ready.md)
  - Использовать для перевода заказа в `Готов к выдаче`.

- `Barista Close Order`
  - Файл: [use-cases/barista-close-order.md](./use-cases/barista-close-order.md)
  - Использовать для закрытия заказа после офлайн-выдачи.

- `Barista Manage Menu Availability`
  - Файл: [use-cases/barista-manage-menu-availability.md](./use-cases/barista-manage-menu-availability.md)
  - Использовать для временного включения и выключения товаров и дополнительных опций.

- `Barista Receive Order Reminder`
  - Файл: [use-cases/barista-receive-order-reminder.md](./use-cases/barista-receive-order-reminder.md)
  - Использовать для напоминаний barista о заказах, ожидающих действий.

- `Administrator Manage Menu`
  - Файл: [use-cases/administrator-manage-menu.md](./use-cases/administrator-manage-menu.md)
  - Использовать для изменения категорий, товаров, цен и групп дополнительных опций.

- `Administrator Manage Slot Settings`
  - Файл: [use-cases/administrator-manage-slot-settings.md](./use-cases/administrator-manage-slot-settings.md)
  - Использовать для рабочих часов и вместимости слотов.

- `Administrator Manage Users And Roles`
  - Файл: [use-cases/administrator-manage-users-and-roles.md](./use-cases/administrator-manage-users-and-roles.md)
  - Использовать для назначения ролей `barista` и `administrator`.

- `Administrator Block User`
  - Файл: [use-cases/administrator-block-user.md](./use-cases/administrator-block-user.md)
  - Использовать для блокировки пользователя.

### `contracts`

- `Customer Ordering`
  - Файл: [contracts/customer-ordering.md](./contracts/customer-ordering.md)
  - Использовать для чтения меню, корзины, выбора слота, создания заказа и истории заказов.

- `Backoffice Order Processing`
  - Файл: [contracts/backoffice-order-processing.md](./contracts/backoffice-order-processing.md)
  - Использовать для операций barista по обработке заказа.

- `Menu And Availability Management`
  - Файл: [contracts/menu-and-availability-management.md](./contracts/menu-and-availability-management.md)
  - Использовать для изменения каталога administrator и оперативной доступности barista.

- `Slot Settings Management`
  - Файл: [contracts/slot-settings-management.md](./contracts/slot-settings-management.md)
  - Использовать для управления рабочими часами, вместимостью и генерации слотов.

- `User Role And Blocking Management`
  - Файл: [contracts/user-role-and-blocking-management.md](./contracts/user-role-and-blocking-management.md)
  - Использовать для bootstrap главного administrator, назначения ролей и блокировки пользователей.

- `Telegram Notifications`
  - Файл: [contracts/telegram-notifications.md](./contracts/telegram-notifications.md)
  - Использовать для customer-уведомлений и barista-напоминаний.

### `ui-contracts`

- `Expressa Customer UI Contract`
  - Файл: [ui-contracts/expressa-customer-ui-contract.json](./ui-contracts/expressa-customer-ui-contract.json)
  - Использовать как входной UI-контракт клиентского Telegram веб-приложения перед формализацией системного поведения.

- `Expressa Backoffice UI Contract`
  - Файл: [ui-contracts/expressa-backoffice-ui-contract.json](./ui-contracts/expressa-backoffice-ui-contract.json)
  - Использовать как компактный parity-документ внутреннего административного контура: он фиксирует канонический референс в `.references/Expressa_admin`, строгие ограничения parity и допустимые исключения только из системных артефактов.

### `ui-behavior-mapping`

- `Customer Ordering`
  - Файл: [ui-behavior-mapping/customer-ordering-ui-binding.md](./ui-behavior-mapping/customer-ordering-ui-binding.md)
  - Использовать для привязки customer UI-контракта к вариантам использования, contracts, validations, state-model и экранным состояниям.

- `Backoffice Operations`
  - Файл: [ui-behavior-mapping/backoffice-ui-binding.md](./ui-behavior-mapping/backoffice-ui-binding.md)
  - Использовать для привязки backoffice UI-действий и состояний к ролевому доступу, операциям заказа, управлению меню, пользователями и настройками без повторного проектирования экранной композиции.

## Быстрый маршрут для следующей роли

- Если задача про создание заказа customer: читать `system-context/expressa-v1-telegram-ordering.md`, `domain-model/ordering-and-pickup.md`, `use-cases/customer-create-pickup-order.md`, `contracts/customer-ordering.md`, `state-models/order-lifecycle.md`.
- Если задача про каталог и допы: читать `domain-model/menu-catalog.md`, `use-cases/administrator-manage-menu.md`, `use-cases/barista-manage-menu-availability.md`, `contracts/menu-and-availability-management.md`.
- Если задача про обработку заказа barista: читать `domain-model/ordering-and-pickup.md`, `state-models/order-lifecycle.md`, `use-cases/barista-confirm-order.md`, `use-cases/barista-reject-order.md`, `use-cases/barista-mark-order-ready.md`, `use-cases/barista-close-order.md`, `contracts/backoffice-order-processing.md`, `contracts/telegram-notifications.md`.
- Если задача про роли, Telegram-доступ и блокировку: читать `domain-model/identity-and-access.md`, `use-cases/administrator-manage-users-and-roles.md`, `use-cases/administrator-block-user.md`, `contracts/user-role-and-blocking-management.md`.
- Если задача про слоты и вместимость: читать `domain-model/ordering-and-pickup.md`, `use-cases/administrator-manage-slot-settings.md`, `contracts/slot-settings-management.md`.
- Если задача приходит из UI-контракта или экранного флоу: читать соответствующий файл в `ui-behavior-mapping/` вместе с целевыми `use-cases`, `contracts` и `state-models`.
- Если задача начинается с экранного контракта: сначала читать соответствующий файл в `ui-contracts/`, затем соответствующий файл в `ui-behavior-mapping/`.
- Если задача про layout или подпоток `menu` внутреннего административного контура: читать `README.md`, затем `ui-contracts/expressa-backoffice-ui-contract.json`, затем нужные файлы в `.references/Expressa_admin`, после этого `ui-behavior-mapping/backoffice-ui-binding.md` и только потом целевые `use-cases`, `contracts`, `domain-model` и `state-models`.

## Зафиксированные blockers и вопросы

- Не согласовано, кто имеет право назначать роль `administrator`: любой `administrator` или только главный administrator.
- Не определена периодичность Telegram-напоминаний barista.
- Не зафиксировано системное поведение при конкурентной попытке занять последний слот выдачи.
- Не определён требуемый уровень snapshot-данных каталога внутри заказа после последующего изменения меню.
- UI-контракты содержат дополнительные расхождения: англоязычные статусы против русскоязычной каноники, действие `unblock_user`, диапазон `slot_capacity 1..50`, real-time индикатор новых заказов и атрибуты товара, не подтверждённые текущими бизнес-правилами.



