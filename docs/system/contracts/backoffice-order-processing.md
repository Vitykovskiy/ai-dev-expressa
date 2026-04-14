# Contract: Backoffice Order Processing

## Граница

Один набор контрактов: операции backoffice по обработке заказа barista.

## Источники

- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/business-rules/order-lifecycle-and-history.md`
- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/scenarios/barista-confirm-order.md`
- `docs/business/scenarios/barista-reject-order.md`
- `docs/business/scenarios/barista-mark-order-ready.md`
- `docs/business/scenarios/barista-close-order.md`

## Общие требования доступа

- Взаимодействие доступно только пользователю, вошедшему через Telegram backoffice-бота.
- Взаимодействие доступно только роли с правом работы во вкладке `Заказы`.

## Contract `Read order queue and order details`

### Outputs

- Очередь заказов.
- Для выбранного заказа: состав и итоговая сумма.

## Contract `Confirm order`

### Inputs

- Идентификатор заказа.
- Идентификатор barista.

### Validations and constraints

- Операция допустима только для заказа в статусе `Создан`.

### Outputs

- Заказ в статусе `Подтвержден`.

### Side effects

- Сохранение `confirmedByBaristaId`.
- Отправка customer уведомления о смене статуса.

### Business errors

- `order-state-transition-not-allowed`

## Contract `Reject order`

### Inputs

- Идентификатор заказа.
- Идентификатор barista.
- Причина отклонения.

### Validations and constraints

- Операция допустима только для заказа в статусе `Создан`.
- Причина отклонения обязательна.

### Outputs

- Заказ в статусе `Отклонен`.

### Side effects

- Сохранение причины отклонения.
- Сохранение `rejectedByBaristaId`.
- Освобождение вместимости выбранного слота.
- Отправка customer уведомления с причиной отклонения.

### Business errors

- `order-state-transition-not-allowed`
- `rejection-reason-required`

## Contract `Mark order ready`

### Inputs

- Идентификатор заказа.
- Идентификатор barista.

### Validations and constraints

- Операция допустима только для заказа в статусе `Подтвержден`.

### Outputs

- Заказ в статусе `Готов к выдаче`.

### Side effects

- Сохранение `readyMarkedByBaristaId`.
- Отправка customer уведомления о готовности заказа.

### Business errors

- `order-state-transition-not-allowed`

## Contract `Close order`

### Inputs

- Идентификатор заказа.

### Validations and constraints

- Операция допустима только для заказа в статусе `Готов к выдаче`.

### Outputs

- Заказ в статусе `Закрыт`.

### Side effects

- Освобождение вместимости выбранного слота.

### Business errors

- `order-state-transition-not-allowed`
