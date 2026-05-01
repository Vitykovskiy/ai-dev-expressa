# UI Behavior Mapping: Backoffice Operations

## Граница

Одна карта привязки: backoffice Telegram веб-приложение для ролей `barista` и `administrator`.

## Источники

- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`
- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `.references/Expressa_admin/src/imports/expressa-backoffice-ui-contract.json`
- `.references/Expressa_admin/src/app`
- `.references/Expressa_admin/src/styles`
- `.references/Expressa_admin/guidelines`
- `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`
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
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/contracts/telegram-notifications.md`
- `docs/system/state-models/order-lifecycle.md`

## Правило parity для UI

Визуальный канон для `layout`, экранной композиции, визуальных состояний и подпотока `menu` задается не этим файлом, а `docs/system/ui-contracts/expressa-backoffice-ui-contract.md` вместе с `.references/Expressa_admin`.

Этот документ фиксирует только системно значимую привязку UI к:

- действиям;
- состояниям;
- guards;
- валидациям;
- ограничениям;
- подтвержденным расхождениям.

Этот документ не является местом для переопределения макета, отступов, цветов, текстов, responsive-поведения или компонентных паттернов из `.references/Expressa_admin`.

Для групп дополнительных опций отдельный экран в `.references/Expressa_admin` не выделен. Во Vue-клиенте `FEATURE-002` отдельная route-level панель или кнопка управления `OptionGroup.options` не является обязательной и не должна добавляться поверх визуального канона. Системное поведение достигается через текущий menu-flow: группа меню помечается toggle `Группа опций`, платные и бесплатные опции добавляются как товары внутри этой группы, а обычная группа меню назначает такую группу через `Выбрать группу опций`.

## Экран к системному поведению

| Экран / UI boundary | Системная цель                                      | Связанные варианты использования                                                                   | Связанные contracts                                                                                      | Связанные правила / модели                                           |
| ------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `orders`            | Очередь заказов и операционные действия по статусам | `barista-confirm-order`, `barista-reject-order`, `barista-mark-order-ready`, `barista-close-order` | `Read order queue and order details`, `Confirm order`, `Reject order`, `Mark order ready`, `Close order` | `BO-001`, `BO-008`–`BO-010`, `OL-004`–`OL-010`, `order-lifecycle.md` |
| `availability`      | Временное управление доступностью каталога          | `barista-manage-menu-availability`                                                                 | `Change temporary availability`                                                                          | `BO-002`, `BO-003`, `BO-012`, `MC-005`–`MC-009`                      |
| `menu`              | Административное управление каталогом               | `administrator-manage-menu`                                                                        | `Manage menu catalog`                                                                                    | `BO-004`, `BO-013`, `MC-001`–`MC-009`                                |
| `users`             | Назначение ролей и блокировка                       | `administrator-manage-users-and-roles`, `administrator-block-user`                                 | `Assign user role`, `Block user`                                                                         | `AR-004`, `AR-006`–`AR-008`, `BO-006`                                |
| `settings`          | Рабочие часы и вместимость слотов                   | `administrator-manage-slot-settings`                                                               | `Manage working hours and slot capacity`                                                                 | `SL-003`–`SL-006`, `BO-005`                                          |

## Entry bootstrap и защитные экраны

| UI boundary     | Системная цель                                                                                                               | Связанные contracts                  | Системные правила                                                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app bootstrap` | Восстановить `AuthenticatedActor` перед показом рабочих экранов backoffice                                                   | `Create backoffice session`          | `frontend-backoffice.md`, `identity-and-access.md`, `backoffice-auth-and-capability-access.md`                                                                        |
| `entry-denied`  | Не показывать рабочий UI без допустимого Telegram entry или server-side auth                                                 | `Create backoffice session`          | Ошибки `telegram-init-data-required`, `telegram-bot-token-required`, `telegram-hash-invalid`, `backoffice-user-not-found`, `user-blocked`, `backoffice-role-required` |
| `forbidden`     | Блокировать прямой переход на route, capability которого нет в `AuthenticatedActor.capabilities` или запрещена backend guard | `Check backoffice capability access` | Ошибка `backoffice-capability-forbidden`; route guard не заменяется скрытием вкладки                                                                                  |

## Ролевые guards и доступность вкладок

| UI правило                                                   | Источник системного правила                  | Смысл                                                                                     |
| ------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `TabBar.tabs.orders` для `barista`, `administrator`          | `BO-012`, `BO-013`, `identity-and-access.md` | Обработка заказов доступна обеим операционным ролям.                                      |
| `TabBar.tabs.availability` для `barista`, `administrator`    | `BO-012`, `BO-013`                           | Оперативная доступность доступна обеим ролям.                                             |
| `TabBar.tabs.menu/users/settings` только для `administrator` | `BO-013`, `BO-015`, `identity-and-access.md` | Административные функции скрыты от `barista`.                                             |
| `navigation.role_guard -> direct URL returns 403 screen`     | `BO-015`, `identity-and-access.md`           | Недостаточная роль должна блокировать доступ не только в навигации, но и по прямому пути. |

## Действия UI к системным операциям

| Экран                                   | UI action                                                                                                                     | Системная операция                             | Условие / результат                                                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orders`                                | `reload_orders`, `pull_to_refresh`                                                                                            | `Read order queue and order details`           | Обновляет операционную очередь заказов.                                                                                                                         |
| `orders`                                | `confirm_order`                                                                                                               | `Confirm order`                                | Допустимо только для заказа в статусе `Создан`.                                                                                                                 |
| `orders`                                | `reject_order` + `ConfirmDialog.reject`                                                                                       | `Reject order`                                 | Требует обязательную причину отклонения.                                                                                                                        |
| `orders`                                | `ready_order`                                                                                                                 | `Mark order ready`                             | Допустимо только для заказа в статусе `Подтвержден`.                                                                                                            |
| `orders`                                | `close_order`                                                                                                                 | `Close order`                                  | Допустимо только для заказа в статусе `Готов к выдаче`.                                                                                                         |
| `availability`                          | `toggle item`                                                                                                                 | `Change temporary availability`                | Меняет только признак доступности.                                                                                                                              |
| `menu.menu_categories`                  | `open_add_category_modal`, `open_edit_category_modal`, `save_category`, `delete_category`                                     | `Manage menu catalog`                          | Изменяет структуру категорий и настройки групп опций.                                                                                                           |
| `menu.menu_categories`                  | `navigate to menu_products`                                                                                                   | `Manage menu catalog`                          | Переносит оператора к составу товаров выбранной группы без смены предметной области.                                                                            |
| `menu.menu_products`                    | `open_add_product_modal`, `delete_product`                                                                                    | `Manage menu catalog`                          | Изменяет состав товаров выбранной категории.                                                                                                                    |
| `menu.menu_products`                    | `navigate to menu_product_detail`                                                                                             | `Manage menu catalog`                          | Открывает детальную настройку товара выбранной группы.                                                                                                          |
| `menu.menu_product_detail`              | `save_product`, `toggle product.has_sizes`, `edit base_price`, `edit size_prices`, `change_category`                          | `Manage menu catalog`                          | Сохраняет товар, ценовую схему и принадлежность к группе.                                                                                                       |
| `menu.option_group_via_category_dialog` | `save_category` + toggle `Группа опций`, `save_product` внутри группы опций, `bind_parent_group` через `Выбрать группу опций` | `Manage menu catalog`                          | Создает группу дополнительных опций как группу меню, добавляет платные/бесплатные опции как товары этой группы и назначает группу опций на обычную группу меню. |
| `users`                                 | `open AssignRoleDialog` + `confirm role=barista`                                                                              | `Assign user role`                             | Назначает роль `barista` и пересчитывает доступ к вкладкам backoffice.                                                                                          |
| `users`                                 | `open AssignRoleDialog` + `confirm role=administrator`                                                                        | `Assign user role`                             | Система должна сохранить роль `administrator` только если операцию выполняет главный administrator.                                                             |
| `users`                                 | `block_user`                                                                                                                  | `Block user`                                   | Переводит пользователя в blocked-состояние.                                                                                                                     |
| `users`                                 | `unblock_user`                                                                                                                | Не зафиксировано текущими системными artifacts | UI-контракт предполагает действие, отсутствующее в текущих бизнес- и системных документах.                                                                      |
| `settings`                              | `save_settings`                                                                                                               | `Manage working hours and slot capacity`       | Сохраняет рабочие часы и вместимость слотов.                                                                                                                    |

## Bootstrap, navigation и direct-route guard

| UI action / состояние                                      | Системная операция                   | Условие / результат                                                                                                                              |
| ---------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | --------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `app_start -> create session`                              | `Create backoffice session`          | Рабочие экраны backoffice не рендерятся до получения `AuthenticatedActor`.                                                                       |
| `session_success -> derive visible tabs from capabilities` | `Create backoffice session`          | Видимость `orders`, `availability`, `menu`, `users`, `settings` берётся только из `AuthenticatedActor.capabilities`.                             |
| `route_enter.orders                                        | availability                         | menu                                                                                                                                             | users | settings` | `Check backoffice capability access` | Прямой route должен быть согласован с backend capability guard, а не только с клиентской навигацией. |
| `session_error.401`                                        | `Create backoffice session`          | UI переводит пользователя на `entry-denied`, потому что валидный Telegram entry не подтверждён.                                                  |
| `session_error.403`                                        | `Create backoffice session`          | UI не показывает рабочий backoffice и переводит пользователя на `entry-denied`, потому что доступ запрещён по системному состоянию пользователя. |
| `route_guard_error.403`                                    | `Check backoffice capability access` | UI переводит пользователя на `forbidden`, если capability запрещена для его текущих roles/capabilities.                                          |

## UI states, validations и system conditions

| UI правило / состояние                                 | Системный источник                                 | Смысл                                                                                                  |
| ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `orders.order_actions.Created`                         | `order-lifecycle.md`                               | Для `Создан` допустимы только подтверждение и отклонение.                                              |
| `orders.order_actions.Confirmed`                       | `order-lifecycle.md`                               | Для `Подтвержден` допустим переход в `Готов к выдаче`.                                                 |
| `orders.order_actions.Ready for pickup`                | `order-lifecycle.md`                               | Для `Готов к выдаче` допустимо закрытие заказа.                                                        |
| `ConfirmDialog.reject.input.required=true`             | `OL-006`, `Reject order`                           | Причина отклонения обязательна.                                                                        |
| `availability.states.toggle_changed.optimistic_update` | `Change temporary availability`                    | UI предполагает обратимый optimistic update при ошибке системного сохранения.                          |
| `settings.validation_error.close_after_open`           | `Manage working hours and slot capacity`           | Время закрытия должно быть позже времени открытия.                                                     |
| `settings.slot_capacity.min=1 max=50`                  | Не зафиксировано в бизнес- или системных artifacts | UI-контракт вводит числовой диапазон, отсутствующий в канонических правилах.                           |
| `users.action_success.toast`                           | `Assign user role`, `Block user`                   | Успешные административные операции должны быть подтверждаемы для оператора.                            |
| `orders.states.realtime.new_order_indicator`           | Не зафиксировано в бизнес- или системных artifacts | UI-контракт предполагает near-realtime обновление очереди заказов.                                     |
| `bootstrap.working_ui_hidden_before_actor_loaded`      | `Create backoffice session`                        | До восстановления `AuthenticatedActor` backoffice не должен показывать рабочие вкладки и действия.     |
| `entry-denied.state`                                   | `Create backoffice session`                        | Экран отказа соответствует невозможности подтвердить допустимый вход или доступ к backoffice boundary. |
| `forbidden.state`                                      | `Check backoffice capability access`               | Экран отказа по роли соответствует запрету на конкретную capability, а не отсутствию Telegram entry.   |

## Навигация и минимальный read set

| UI boundary                  | Минимальный read set для следующей роли                                                                                                                                                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orders`                     | `state-models/order-lifecycle.md`, `use-cases/barista-confirm-order.md`, `use-cases/barista-reject-order.md`, `use-cases/barista-mark-order-ready.md`, `use-cases/barista-close-order.md`, `contracts/backoffice-order-processing.md`, `contracts/telegram-notifications.md` |
| `availability`               | `domain-model/menu-catalog.md`, `use-cases/barista-manage-menu-availability.md`, `contracts/menu-and-availability-management.md`                                                                                                                                             |
| `menu`                       | `domain-model/menu-catalog.md`, `use-cases/administrator-manage-menu.md`, `contracts/menu-and-availability-management.md`                                                                                                                                                    |
| `users`                      | `domain-model/identity-and-access.md`, `use-cases/administrator-manage-users-and-roles.md`, `use-cases/administrator-block-user.md`, `contracts/user-role-and-blocking-management.md`                                                                                        |
| `settings`                   | `domain-model/ordering-and-pickup.md`, `use-cases/administrator-manage-slot-settings.md`, `contracts/slot-settings-management.md`                                                                                                                                            |
| `entry bootstrap and guards` | `domain-model/identity-and-access.md`, `contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`                                                               |

## Handoff route for FEATURE-001

- Для backoffice entry и route guard исполнитель читает `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`, затем `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`, затем `docs/system/contracts/backoffice-auth-and-capability-access.md`, затем эту карту.
- Система должна использовать `AuthenticatedActor.capabilities` для видимости вкладок и direct-route guard без чтения backend implementation.
- Система должна отличать `entry-denied` от `forbidden` как разные protected states.

## Зафиксированные расхождения и пробелы

- UI-контракт backoffice описывает действие `unblock_user`, но в утверждённых бизнес-правилах и текущих системных artifacts зафиксирована только блокировка пользователя. До уточнения это действие нельзя считать разрешённым системным поведением.
- JSON-слой UI-контракта backoffice содержит action item `assign_barista`, а React-референс `UsersScreen` открывает `AssignRoleDialog` с выбором ролей `barista` и `administrator`. Для `FEATURE-004` активный экранный поток назначения роли считается представленным в React-референсе; назначение роли `administrator` ограничено главным administrator.
- UI-контракт backoffice вводит конкретный диапазон `slot_capacity` `1..50`, но в бизнес-артефактах есть только право менять вместимость и дефолт `5`; верхняя граница `50` пока не подтверждена.
- UI-контракт backoffice предполагает real-time индикатор новых заказов и анимацию появления, но это не отражено в бизнес- или системных требованиях как обязательное поведение.
- UI-контракт `menu_product_detail` включает поле `image`, хотя в текущей бизнес- и системной модели меню наличие изображений товаров не зафиксировано как обязательный или подтверждённый атрибут.
- React-референс `.references/Expressa_admin` не содержит отдельного экрана `addon_group_detail`; для `FEATURE-002` обязательным считается текущий сценарий через диалоги групп и товаров, а отдельная панель групп опций считается лишним UI.
