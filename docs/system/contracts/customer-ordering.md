# Contract: Customer Ordering

## Граница

Один набор контрактов: взаимодействия customer-приложения с системой для просмотра каталога, управления корзиной, выбора слота, создания заказа и просмотра истории заказов.

## Источники

- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/order-lifecycle-and-history.md`
- `docs/business/scenarios/customer-place-pickup-order.md`
- `docs/business/scenarios/customer-view-order-history.md`

## Contract `Open customer application`

### Inputs

- Telegram-центричный контекст входа customer или test-mode исключение.

### Validations and constraints

- Рабочий доступ без Telegram не допускается.
- Заблокированный пользователь не допускается к приложению.

### Outputs

- Допуск в customer-приложение.

### Business errors

- `blocked-user`
- `telegram-entry-required`

## Contract `Read menu catalog`

### Inputs

- Контекст customer-приложения.

### Outputs

- Категории меню.
- Доступные товары.
- Доступные дополнительные опции.
- Для напитков: размеры `S`, `M`, `L` и связанные с ними цены.

### Constraints

- Дополнительные опции не возвращаются как самостоятельные позиции меню.
- Возвращаются только позиции и опции, доступные для customer-сценария.

## Contract `Mutate cart`

### Inputs

- Товар.
- Количество.
- Размер напитка, если товар является напитком.
- Выбранные дополнительные опции.

### Validations and constraints

- Для напитка размер обязателен.
- Для взаимоисключающей группы допускается не более одной выбранной опции.

### Outputs

- Обновлённое состояние корзины.

### Business errors

- `required-drink-size-missing`
- `mutually-exclusive-options-violated`
- `unavailable-menu-item`
- `unavailable-option`

## Contract `Read pickup slots`

### Inputs

- Контекст customer-приложения.

### Outputs

- Доступные слоты текущего дня.

### Constraints

- Слоты имеют шаг 10 минут.
- Слоты формируются только внутри рабочих часов.
- Слоты вне текущего дня не возвращаются.

## Contract `Create order from cart`

### Inputs

- Корзина customer.
- Выбранный слот выдачи текущего дня.

### Validations and constraints

- Корзина должна содержать хотя бы одну позицию.
- Слот должен быть доступен на текущий день.
- Заказ в результате создаётся со статусом `Создан`.
- Новый заказ начинает занимать вместимость выбранного слота.

### Outputs

- Созданный заказ.
- Статус `Создан`.

### Business errors

- `empty-cart`
- `slot-unavailable`
- `slot-out-of-range`
- `cart-contains-invalid-item`

### Side effects

- Увеличение числа активных заказов для выбранного слота.
- Появление заказа в истории заказов customer.

## Contract `Read own order history`

### Inputs

- Контекст customer-приложения.

### Outputs

- Список заказов текущего customer с их текущими статусами.

### Constraints

- Возвращаются только заказы, принадлежащие текущему customer.
