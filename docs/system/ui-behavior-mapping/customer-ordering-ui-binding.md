# UI Behavior Mapping: Customer Ordering

## Граница

Одна карта привязки: клиентское Telegram веб-приложение для выбора меню, корзины, слотов и истории заказов.

## Источники

- `docs/system/ui-contracts/expressa-customer-ui-contract.json`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/order-lifecycle-and-history.md`
- `docs/system/use-cases/customer-create-pickup-order.md`
- `docs/system/use-cases/customer-view-order-history.md`
- `docs/system/contracts/customer-ordering.md`
- `docs/system/contracts/telegram-notifications.md`
- `docs/system/state-models/order-lifecycle.md`

## Принцип использования

- Этот артефакт связывает экранное поведение с системными вариантами использования, contracts, state-models и бизнес-правилами.
- Этот артефакт не является источником правды по визуальному оформлению, design tokens и декоративным состояниям.

## Экран к системному поведению

| Экран / UI boundary | Системная цель | Связанные варианты использования | Связанные contracts | Связанные правила / модели |
|---|---|---|---|---|
| `welcome` | Вход в customer-путь заказа | `customer-create-pickup-order` | `Open customer application` | `AR-001`, `AR-009` |
| `menu_categories` | Показать каталог по категориям | `customer-create-pickup-order` | `Read menu catalog` | `MC-001` |
| `menu_category_products` | Показать товары выбранной категории | `customer-create-pickup-order` | `Read menu catalog` | `MC-001` |
| `product` | Настроить состав позиции и добавить её в корзину | `customer-create-pickup-order` | `Mutate cart` | `MC-002`–`MC-008` |
| `cart` | Просмотр и редактирование корзины | `customer-create-pickup-order` | `Mutate cart` | `OL-001` |
| `slot_picker` | Показать доступные слоты и создать заказ | `customer-create-pickup-order` | `Read pickup slots`, `Create order from cart` | `SL-001`–`SL-008`, `OL-002`, `OL-003` |
| `order_history` | Показать список заказов customer | `customer-view-order-history` | `Read own order history` | `OL-008` |
| `order_detail` | Показать состояние и состав конкретного заказа | `customer-view-order-history` | `Read own order history` | `OL-004`, `OL-009`, `OL-010`, `state-models/order-lifecycle.md` |

## Действия UI к системным операциям

| Экран | UI action | Системная операция | Условие / результат |
|---|---|---|---|
| `welcome` | `welcome_cta -> navigate menu_categories` | `Open customer application` | Переход в каталог допустим только после Telegram-входа или test-mode исключения. |
| `menu_categories` | `on_tap category` | `Read menu catalog` | Открывает товары выбранной категории. |
| `menu_category_products` | `on_tap product` | `Read menu catalog` | Открывает настройку товара. |
| `product` | `size_chips.on_select` | `Mutate cart` preparation | Обновляет валидный состав позиции и расчёт итоговой суммы. |
| `product` | `addon_chips.on_select` | `Mutate cart` preparation | Применяет ограничения по взаимоисключаемым и множественным опциям. |
| `product` | `AddToCartBar.add_button` | `Mutate cart` | Добавляет позицию в корзину только при валидном составе. |
| `cart` | `remove_button` | `Mutate cart` | Удаляет позицию из корзины. |
| `cart` | `cart_checkout_button` | `Read pickup slots` | Переход к выбору слота. |
| `slot_picker` | `slot_grid select` | `Read pickup slots` | Выбор конкретного доступного слота текущего дня. |
| `slot_picker` | `slot_confirm_button -> create_order` | `Create order from cart` | Создаёт заказ со статусом `Создан`, если корзина и слот валидны. |
| `order_history` | `on_tap order` | `Read own order history` | Открывает детализацию заказа текущего customer. |

## UI guards, visibility и validations

| UI правило | Источник системного правила | Смысл |
|---|---|---|
| `PersistentTopBar.nav_history` и `nav_cart` доступны на большинстве экранов | `customer-view-order-history`, `Mutate cart` | История заказов и корзина являются отдельными системными целями, доступными из customer-потока. |
| `product_size_group.visible_when=product.has_sizes` | `MC-003`, `MC-004`, `menu-catalog.md` | Блок размеров существует только для напитков. |
| `size_chips.selection=single_required` | `MC-003` | Для напитка размер обязателен и выбирается один. |
| `AddToCartBar.add_button.disabled_when=product.has_sizes && size_not_selected` | `MC-003`, `Mutate cart` | Нельзя добавить напиток в корзину без выбора обязательного размера. |
| `addon_chips.selection_single=single_optional` | `MC-008` | Во взаимоисключающей группе допускается не более одной опции. |
| `addon_chips.selection_multiple=multi_optional` | `MC-007` | Во множественной группе допускается несколько опций. |
| `ProductRow.unavailable.pointer_events=none` | `menu-catalog.md`, `Change temporary availability` | Временно недоступный товар нельзя открыть для заказа. |
| `slot_confirm_button.disabled_when=slot_not_selected` | `OL-002`, `Create order from cart` | Заказ не создаётся без выбранного слота. |
| `SlotButton.full.pointer_events=none` | `SL-007`, `SL-008`, `Generate available slots` | Переполненный слот не может быть выбран. |
| `order_detail.content_map.Rejected includes rejection_reason` | `OL-006`, `OL-010` | Для отклонённого заказа причина должна быть доступна customer. |

## UI состояния к системным условиям

| UI state | Системное условие | Источник |
|---|---|---|
| `menu_categories.empty` | В каталоге нет доступных категорий / товаров для показа | `Read menu catalog` |
| `product.size_not_selected` | Нарушено обязательное условие выбора размера для напитка | `MC-003` |
| `product.added` | Операция `Mutate cart` завершена успешно | `Mutate cart` |
| `cart.empty` | В корзине нет позиций | `Mutate cart` |
| `cart.item_removed` | Позиция успешно удалена из корзины | `Mutate cart` |
| `slot_picker.no_slots_available` | Для текущего дня отсутствуют доступные слоты | `Generate available slots` |
| `slot_picker.outside_working_hours` | Вне действующего интервала рабочих часов нет доступных слотов | `SL-001`, `SL-003`, `SL-005` |
| `slot_picker.order_created` | Заказ успешно создан и перешёл в состояние `Создан` | `Create order from cart`, `order-lifecycle` |
| `order_history.empty` | У customer ещё нет заказов | `Read own order history` |
| `order_detail.status_badge/content_map` | Отображение текущего `OrderStatus` в пользовательском интерфейсе | `order-lifecycle.md`, `OL-004` |

## Навигация к вариантам использования

| Переход UI | Системный смысл |
|---|---|
| `welcome -> menu_categories` | Вход в сценарий создания заказа. |
| `menu_categories -> menu_category_products -> product -> cart -> slot_picker` | Сквозной системный вариант использования создания заказа. |
| `slot_picker -> order_history` после `order_created` | Заказ создан и доступен в истории. |
| `order_history -> order_detail` | Просмотр статуса и деталей существующего заказа. |

## Зафиксированные расхождения и пробелы

- В UI-контракте customer используются англоязычные статусы `Created`, `Confirmed`, `Ready for pickup`, `Rejected`, `Closed`, тогда как в системных и бизнес-артефактах зафиксированы русскоязычные статусы `Создан`, `Подтвержден`, `Готов к выдаче`, `Отклонен`, `Закрыт`. Требуется единая каноническая mapping-таблица на уровне системы или API-контракта.
- UI-контракт содержит экран `order_detail`, а в текущих системных contracts нет отдельной операции чтения детальной карточки заказа; пока этот экран опирается на общий контракт `Read own order history`. Если для разработки нужен отдельный boundary чтения детализации заказа, его следует выделить в отдельный contract.
- UI-контракт предполагает поле `product.description`, но в текущем доменном описании меню это поле не зафиксировано как обязательный или подтверждённый атрибут.


