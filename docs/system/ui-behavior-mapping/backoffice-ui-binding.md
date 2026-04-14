# UI Behavior Mapping: Backoffice Operations

## Граница

Одна карта привязки: backoffice Telegram WebApp для ролей `barista` и `administrator`.

## Источники

- `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/order-lifecycle-and-history.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/use-cases/barista-confirm-order.md`
- `docs/system/use-cases/barista-reject-order.md`
- `docs/system/use-cases/barista-mark-order-ready.md`
- `docs/system/use-cases/barista-close-order.md`
- `docs/system/use-cases/barista-manage-menu-availability.md`
- `docs/system/use-cases/barista-receive-order-reminder.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/use-cases/administrator-manage-slot-settings.md`
- `docs/system/use-cases/administrator-manage-users-and-roles.md`
- `docs/system/use-cases/administrator-block-user.md`
- `docs/system/contracts/backoffice-order-processing.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/contracts/telegram-notifications.md`
- `docs/system/state-models/order-lifecycle.md`

## Экран к системному поведению

| Экран / UI boundary | Системная цель | Связанные use cases | Связанные contracts | Связанные правила / модели |
|---|---|---|---|---|
| `orders` | Очередь заказов и операционные действия по статусам | `barista-confirm-order`, `barista-reject-order`, `barista-mark-order-ready`, `barista-close-order` | `Read order queue and order details`, `Confirm order`, `Reject order`, `Mark order ready`, `Close order` | `BO-001`, `BO-008`–`BO-010`, `OL-004`–`OL-010`, `order-lifecycle.md` |
| `availability` | Временное управление доступностью каталога | `barista-manage-menu-availability` | `Change temporary availability` | `BO-002`, `BO-003`, `BO-012`, `MC-005`–`MC-009` |
| `menu` | Административное управление каталогом | `administrator-manage-menu` | `Manage menu catalog` | `BO-004`, `BO-013`, `MC-001`–`MC-009` |
| `users` | Назначение ролей и блокировка | `administrator-manage-users-and-roles`, `administrator-block-user` | `Assign user role`, `Block user` | `AR-004`, `AR-006`–`AR-008`, `BO-006` |
| `settings` | Рабочие часы и вместимость слотов | `administrator-manage-slot-settings` | `Manage working hours and slot capacity` | `SL-003`–`SL-006`, `BO-005` |

## Ролевые guards и доступность вкладок

| UI правило | Источник системного правила | Смысл |
|---|---|---|
| `TabBar.tabs.orders` для `barista`, `administrator` | `BO-012`, `BO-013`, `identity-and-access.md` | Обработка заказов доступна обеим операционным ролям. |
| `TabBar.tabs.availability` для `barista`, `administrator` | `BO-012`, `BO-013` | Оперативная доступность доступна обеим ролям. |
| `TabBar.tabs.menu/users/settings` только для `administrator` | `BO-013`, `AR-008` | Административные функции скрыты от `barista`. |
| `navigation.role_guard -> direct URL returns 403 screen` | `AR-008`, `identity-and-access.md` | Недостаточная роль должна блокировать доступ не только в навигации, но и по прямому пути. |

## Действия UI к системным операциям

| Экран | UI action | Системная операция | Условие / результат |
|---|---|---|---|
| `orders` | `reload_orders`, `pull_to_refresh` | `Read order queue and order details` | Обновляет операционную очередь заказов. |
| `orders` | `confirm_order` | `Confirm order` | Допустимо только для заказа в статусе `Создан`. |
| `orders` | `reject_order` + `ConfirmDialog.reject` | `Reject order` | Требует обязательную причину отклонения. |
| `orders` | `ready_order` | `Mark order ready` | Допустимо только для заказа в статусе `Подтвержден`. |
| `orders` | `close_order` | `Close order` | Допустимо только для заказа в статусе `Готов к выдаче`. |
| `availability` | `toggle item` | `Change temporary availability` | Меняет только признак доступности. |
| `menu.menu_categories` | `open_add_category_modal`, `delete_category` | `Manage menu catalog` | Изменяет структуру категорий. |
| `menu.menu_products` | `open_add_product_modal`, `delete_product` | `Manage menu catalog` | Изменяет состав товаров выбранной категории. |
| `menu.menu_product_detail` | `save_product` | `Manage menu catalog` | Сохраняет товар, цены, размеры и связанные группы допов. |
| `menu.addon_group_detail` | `save_addon_group` | `Manage menu catalog` | Сохраняет тип выбора и состав группы допов. |
| `users` | `assign_barista` | `Assign user role` | Назначает роль `barista`. |
| `users` | `block_user` | `Block user` | Переводит пользователя в blocked-состояние. |
| `users` | `unblock_user` | Не зафиксировано текущими системными artifacts | UI-контракт предполагает действие, отсутствующее в текущих бизнес- и системных документах. |
| `settings` | `save_settings` | `Manage working hours and slot capacity` | Сохраняет рабочие часы и вместимость слотов. |

## UI states, validations и system conditions

| UI правило / состояние | Системный источник | Смысл |
|---|---|---|
| `orders.order_actions.Created` | `order-lifecycle.md` | Для `Создан` допустимы только подтверждение и отклонение. |
| `orders.order_actions.Confirmed` | `order-lifecycle.md` | Для `Подтвержден` допустим переход в `Готов к выдаче`. |
| `orders.order_actions.Ready for pickup` | `order-lifecycle.md` | Для `Готов к выдаче` допустимо закрытие заказа. |
| `ConfirmDialog.reject.input.required=true` | `OL-006`, `Reject order` | Причина отклонения обязательна. |
| `availability.states.toggle_changed.optimistic_update` | `Change temporary availability` | UI предполагает обратимый optimistic update при ошибке системного сохранения. |
| `settings.validation_error.close_after_open` | `Manage working hours and slot capacity` | Время закрытия должно быть позже времени открытия. |
| `settings.slot_capacity.min=1 max=50` | Не зафиксировано в бизнес- или системных artifacts | UI-контракт вводит числовой диапазон, отсутствующий в канонических правилах. |
| `users.action_success.toast` | `Assign user role`, `Block user` | Успешные административные операции должны быть подтверждаемы для оператора. |
| `orders.states.realtime.new_order_indicator` | Не зафиксировано в бизнес- или системных artifacts | UI-контракт предполагает near-realtime обновление очереди заказов. |

## Навигация и минимальный read set

| UI boundary | Минимальный read set для следующей роли |
|---|---|
| `orders` | `state-models/order-lifecycle.md`, `use-cases/barista-confirm-order.md`, `use-cases/barista-reject-order.md`, `use-cases/barista-mark-order-ready.md`, `use-cases/barista-close-order.md`, `contracts/backoffice-order-processing.md`, `contracts/telegram-notifications.md` |
| `availability` | `domain-model/menu-catalog.md`, `use-cases/barista-manage-menu-availability.md`, `contracts/menu-and-availability-management.md` |
| `menu` | `domain-model/menu-catalog.md`, `use-cases/administrator-manage-menu.md`, `contracts/menu-and-availability-management.md` |
| `users` | `domain-model/identity-and-access.md`, `use-cases/administrator-manage-users-and-roles.md`, `use-cases/administrator-block-user.md`, `contracts/user-role-and-blocking-management.md` |
| `settings` | `domain-model/ordering-and-pickup.md`, `use-cases/administrator-manage-slot-settings.md`, `contracts/slot-settings-management.md` |

## Зафиксированные расхождения и пробелы

- UI-контракт backoffice описывает действие `unblock_user`, но в утверждённых бизнес-правилах и текущих системных artifacts зафиксирована только блокировка пользователя. До уточнения это действие нельзя считать разрешённым системным поведением.
- UI-контракт backoffice допускает назначение роли только `barista` через явные action items (`assign_barista`, `revoke_barista`), тогда как бизнес- и системные документы также содержат назначение роли `administrator`. Требуется согласовать, где и как это действие должно быть представлено в UI.
- UI-контракт backoffice вводит конкретный диапазон `slot_capacity` `1..50`, но в бизнес-артефактах есть только право менять вместимость и дефолт `5`; верхняя граница `50` пока не подтверждена.
- UI-контракт backoffice предполагает real-time индикатор новых заказов и анимацию появления, но это не отражено в бизнес- или системных требованиях как обязательное поведение.
- UI-контракт `menu_product_detail` включает поле `image`, хотя в текущей бизнес- и системной модели меню наличие изображений товаров не зафиксировано как обязательный или подтверждённый атрибут.
